import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findOne(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            email: createUserDto.email,
            password: hashedPassword,
            profile: {
                create: {
                    nickname: createUserDto.nickname,
                },
            },
            progress: {
                create: {}, // Initialize empty progress
            },
        });

        const payload = { email: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, profile: user.profile },
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            user: user,
        };
    }

    async loginWithSecret(secret: string) {
        const normalizedSecret = secret.toLowerCase().trim();
        const MAIN_USER_PHRASE = 'sii baby';
        const MAIN_USER_EMAIL = 'sii@baby.com'; // Fixed email for her

        let user;

        if (normalizedSecret === MAIN_USER_PHRASE) {
            // Log in the main user (Sii Baby)
            user = await this.usersService.findOne(MAIN_USER_EMAIL);

            if (!user) {
                // Determine a safe password (she won't use it, but needed for DB)
                const hashedPassword = await bcrypt.hash('love_forever_2024', 10);
                user = await this.usersService.create({
                    email: MAIN_USER_EMAIL,
                    password: hashedPassword,
                    profile: {
                        create: {
                            nickname: 'Sii Baby 💖', // Her special display name
                        },
                    },
                    progress: { create: {} },
                });
            }
        } else {
            // Guest Login
            // Check if a guest with this nickname exists, or just create a new one?
            // To allow progress saving for guests, we might want to try to find them by nickname.
            // But nicknames aren't unique in our schema (Profile.nickname).
            // Strategy: Generate a unique email based on the nickname to allowing "re-login" if they type the exact same thing?
            // Or just allow duplicates for now. Let's make it deterministic so they can "resume" if they type the same name.

            // Sanitize nickname for email
            const safeNick = normalizedSecret.replace(/[^a-z0-9]/g, '');
            const guestEmail = `guest_${safeNick}@valentine.app`;

            user = await this.usersService.findOne(guestEmail);

            if (!user) {
                const hashedPassword = await bcrypt.hash('guest_pass', 10);
                user = await this.usersService.create({
                    email: guestEmail,
                    password: hashedPassword,
                    profile: {
                        create: {
                            nickname: secret, // Keep original casing for display
                        },
                    },
                    progress: { create: {} },
                });
            }
        }

        return this.login(user);
    }
}
