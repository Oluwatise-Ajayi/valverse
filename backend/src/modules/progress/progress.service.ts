import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
        const existingGameData = (existingStates[gameId] as Prisma.JsonObject) || {};

        // Merge new state with existing game data to preserve other fields
        const newGameData = {
            ...existingGameData,
            ...state,
        };

        // Update the top-level game states
        const newStates = {
            ...existingStates,
            [gameId]: newGameData,
        };

        return this.prisma.progress.update({
            where: { userId },
            data: { gameStates: newStates as Prisma.InputJsonValue },
        });
    }
}
