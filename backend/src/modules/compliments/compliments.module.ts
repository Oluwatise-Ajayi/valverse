import { Module } from '@nestjs/common';
import { ComplimentsController } from './compliments.controller';
import { ComplimentsService } from './compliments.service';

@Module({
    controllers: [ComplimentsController],
    providers: [ComplimentsService],
})
export class ComplimentsModule { }
