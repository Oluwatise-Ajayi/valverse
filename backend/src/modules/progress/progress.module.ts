import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [PrismaModule, UsersModule],
    providers: [ProgressService],
    controllers: [ProgressController],
    exports: [ProgressService],
})
export class ProgressModule { }
