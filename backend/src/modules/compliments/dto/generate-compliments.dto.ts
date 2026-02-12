import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GenerateComplimentsDto {
    @IsString()
    @IsNotEmpty()
    interest: string;

    @IsOptional()
    @IsNumber()
    count?: number;
}
