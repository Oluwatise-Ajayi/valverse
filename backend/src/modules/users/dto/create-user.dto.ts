import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty()
    password: string;

    nickname?: string;
}
