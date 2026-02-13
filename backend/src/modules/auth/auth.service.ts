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
        console.log(`[AuthService] Attempting login with secret: "${secret}"`);
        if (!secret) {
            throw new UnauthorizedException('Secret is required');
        }

        const normalizedSecret = secret.toLowerCase().trim();
        const MAIN_USER_PHRASE = 'sii baby';
        const MAIN_USER_EMAIL = 'sii@baby.com'; // Fixed email for her

        let user;

        if (normalizedSecret === MAIN_USER_PHRASE) {
            console.log('[AuthService] Main user login attempt');
            // Log in the main user (Sii Baby)
            user = await this.usersService.findOne(MAIN_USER_EMAIL);

            if (!user) {
                console.log('[AuthService] Creating main user');
                // Determine a safe password (she won't use it, but needed for DB)
                const hashedPassword = await bcrypt.hash('love_forever_2024', 10);
                try {
                    user = await this.usersService.create({
                        email: MAIN_USER_EMAIL,
                        password: hashedPassword,
                        profile: {
                            create: {
                                nickname: 'Sii Baby 💖', // Her special display name
                                avatarUrl: '/images/babe_makeup.jpg',
                            },
                        },
                        progress: { create: {} },
                    });
                } catch (error) {
                    console.error('[AuthService] Error creating main user:', error);
                    throw error;
                }
            } else {
                // Ensure profile pic is updated if it was missing or different
                if (user.profile && user.profile.avatarUrl !== '/images/babe_makeup.jpg') {
                    await this.usersService.updateProfile(user.id, {
                        avatarUrl: '/images/babe_makeup.jpg'
                    });
                    // Refetch user to get updated profile
                    user = await this.usersService.findOne(MAIN_USER_EMAIL);
                }
            }
        } else {
            console.log('[AuthService] Guest user login attempt');
            // Guest Login
            // Sanitize nickname for email
            const safeNick = normalizedSecret.replace(/[^a-z0-9]/g, '');
            const effectiveNick = safeNick || 'guest';
            const guestEmail = `guest_${effectiveNick}@valentine.app`;

            console.log(`[AuthService] Guest email: ${guestEmail}`);

            user = await this.usersService.findOne(guestEmail);

            if (!user) {
                console.log(`[AuthService] Creating guest user for ${guestEmail}`);
                const hashedPassword = await bcrypt.hash('guest_pass', 10);
                try {
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
                } catch (error) {
                    console.error('[AuthService] Error creating guest user:', error);
                    throw error;
                }
            }
        }

        return this.login(user);
    }
}
