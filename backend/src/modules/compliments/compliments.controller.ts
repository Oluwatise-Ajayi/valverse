import { Body, Controller, Post } from '@nestjs/common';
import { ComplimentsService } from './compliments.service';
import { GenerateComplimentsDto } from './dto/generate-compliments.dto';

@Controller('compliments')
export class ComplimentsController {
    constructor(private readonly complimentsService: ComplimentsService) { }

    @Post('generate')
    async generate(@Body() dto: GenerateComplimentsDto) {
        return this.complimentsService.generate(dto.interest, dto.count);
    }
}
