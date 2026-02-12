import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMediaRewardDto } from './dto/create-media-reward.dto';
import { ConfigService } from '@nestjs/config';

// Cloudinary import
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    // Get all media rewards
    async getAllMedia() {
        return this.prisma.media.findMany({
            orderBy: { id: 'desc' },
        });
    }

    // Create text/compliment reward (no upload)
    async createMediaReward(dto: CreateMediaRewardDto) {
        return this.prisma.media.create({
            data: {
                title: dto.title,
                description: dto.description,
                type: dto.type,
                url: dto.url || '', // Empty for TEXT/COMPLIMENT
                requiredGame: dto.requiredGame,
                threshold: dto.threshold || {},
            },
        });
    }

    // Upload media to Cloudinary and create record
    async uploadMediaReward(file: Express.Multer.File, dto: CreateMediaRewardDto) {
        let uploadResult;

        try {
            // Determine resource type based on media type
            const resourceType = dto.type === 'VIDEO' ? 'video' : dto.type === 'AUDIO' ? 'video' : 'image';

            // Upload to Cloudinary
            uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: resourceType,
                        folder: `valentine-rewards/${dto.requiredGame}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(file.buffer);
            });

            // Create database record
            return this.prisma.media.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    type: dto.type,
                    url: (uploadResult as any).secure_url,
                    requiredGame: dto.requiredGame,
                    threshold: dto.threshold || {},
                },
            });
        } catch (error) {
            throw new Error(`Failed to upload media: ${error.message}`);
        }
    }

    // Delete media reward
    async deleteMedia(id: string) {
        const media = await this.prisma.media.findUnique({
            where: { id },
        });

        if (!media) {
            throw new NotFoundException(`Media with ID ${id} not found`);
        }

        // Delete from database
        await this.prisma.media.delete({
            where: { id },
        });

        // Optionally delete from Cloudinary
        // Extract public_id from URL and delete
        if (media.url && media.url.includes('cloudinary')) {
            try {
                const publicId = media.url.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error('Failed to delete from Cloudinary:', error);
            }
        }

        return { message: 'Media deleted successfully' };
    }

    // Get media by game
    async getMediaByGame(gameId: string) {
        return this.prisma.media.findMany({
            where: { requiredGame: gameId },
            orderBy: { id: 'desc' },
        });
    }
}
