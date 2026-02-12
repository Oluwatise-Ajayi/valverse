
import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    imports: [],
    controllers: [StoryController],
    providers: [StoryService, PrismaService],
})
export class StoryModule { }
