import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

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

    async saveUserUpload(userId: string, file: Express.Multer.File) {
        try {
            // Determine type based on mimetype
            const mime = file.mimetype.split('/')[0].toUpperCase();
            let type: 'IMAGE' | 'VIDEO' | 'AUDIO' = 'IMAGE';
            if (mime === 'AUDIO') type = 'AUDIO';
            if (mime === 'VIDEO') type = 'VIDEO';

            const resourceType = type === 'VIDEO' || type === 'AUDIO' ? 'video' : 'image';

            // Upload to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: resourceType,
                        folder: `valentine-uploads/${userId}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            const media = await this.prisma.media.create({
                data: {
                    title: file.originalname,
                    url: (uploadResult as any).secure_url,
                    type,
                    userId,
                    // These are optional
                    requiredGame: null as any,
                    threshold: null as any,
                },
            });

            return media;
        } catch (error) {
            console.error('Error in saveUserUpload:', error);
            throw new InternalServerErrorException('Failed to upload file');
        }
    }
}
