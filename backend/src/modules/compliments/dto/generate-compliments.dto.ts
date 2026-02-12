import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateComplimentsDto {
    @IsString()
    @IsNotEmpty()
    interest: string;
}
