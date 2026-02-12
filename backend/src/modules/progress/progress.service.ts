import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma-local/client';

@Injectable()
export class ProgressService {
    constructor(private prisma: PrismaService) { }

    async getUserProgress(userId: string) {
        const progress = await this.prisma.progress.findUnique({
            where: { userId },
            include: { unlockedMedia: { include: { media: true } } },
        });
        if (!progress) throw new NotFoundException('Progress not found');
        return progress;
    }

    async updateValentineAnswer(userId: string, answer: boolean) {
        return this.prisma.progress.update({
            where: { userId },
            data: { valentineAnswer: answer },
        });
    }

    async updateQuizScore(userId: string, score: number) {
        return this.prisma.progress.update({
            where: { userId },
            data: {
                quizScore: score,
                quizCompleted: score > 0
            },
        });
    }

    async updateGameState(userId: string, gameId: string, state: any) {
        const current = await this.getUserProgress(userId);
        const existingStates = (current.gameStates as Prisma.JsonObject) || {};

        // Merge new state
        const newStates = {
            ...existingStates,
            [gameId]: state,
        };

        return this.prisma.progress.update({
            where: { userId },
            data: { gameStates: newStates },
        });
    }
}
