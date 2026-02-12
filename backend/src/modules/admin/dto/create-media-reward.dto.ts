import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum MediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    TEXT = 'TEXT',
    COMPLIMENT = 'COMPLIMENT'
}

export class CreateMediaRewardDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(MediaType)
    @IsNotEmpty()
    type: MediaType;

    @IsString()
    @IsOptional()
    url?: string; // Only for TEXT/COMPLIMENT types

    @IsString()
    @IsNotEmpty()
    requiredGame: string; // e.g., "scratch", "catch-hearts", "bouquet", etc.

    @IsObject()
    @IsOptional()
    threshold?: any; // e.g., { "score": 100 } or { "completion": true }
}
