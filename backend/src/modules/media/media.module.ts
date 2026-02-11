import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProgressModule } from '../progress/progress.module';

@Module({
    imports: [PrismaModule, ProgressModule],
    providers: [MediaService],
    controllers: [MediaController],
})
export class MediaModule { }
