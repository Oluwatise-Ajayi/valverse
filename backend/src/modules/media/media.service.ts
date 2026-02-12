import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MediaService {
    constructor(private prisma: PrismaService) { }

    async getRewardsByGame(gameId: string) {
        try {
            const rewards = await this.prisma.media.findMany({
                where: { requiredGame: gameId },
                orderBy: { id: 'desc' },
            });
            return rewards;
        } catch (error) {
            // Return empty array if database error (not configured yet)
            console.log('Database not configured, returning empty rewards array');
            return [];
        }
    }
}
