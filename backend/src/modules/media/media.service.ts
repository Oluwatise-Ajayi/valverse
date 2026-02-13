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
            console.log('Database not configured, returning empty rewards array');
            return [];
        }
    }

    async getUserUploads(userId: string) {
        return this.prisma.media.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
        });
    }

    async saveUserUpload(userId: string, title: string, url: string, type: 'IMAGE' | 'VIDEO' | 'AUDIO') {
        const media = await this.prisma.media.create({
            data: {
                title,
                url,
                type,
                userId,
                // These are optional now for user uploads
                requiredGame: null as any,
                threshold: null as any,
            },
        });

        // Also create an Unlock record so it shows up as unlocked
        // Wait, Unlocks link to Progress.
        // User uploads are inherently unlocked. 
        // We can just rely on fetching media by userId for the vault.
        return media;
    }
}
