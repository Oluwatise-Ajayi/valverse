import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';
// import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
    constructor(
        private prisma: PrismaService,
        private progressService: ProgressService,
    ) { }

    async findAll() {
        return this.prisma.media.findMany();
    }

    async getSignedUrl(userId: string, mediaId: string) {
        // 1. Check if user unlocked this media
        const progress = await this.progressService.getUserProgress(userId);
        const unlocked = progress.unlockedMedia.find((u) => u.mediaId === mediaId);

        if (!unlocked) {
            throw new ForbiddenException('Media not unlocked yet');
        }

        const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
        if (!media) throw new NotFoundException('Media not found');

        // 2. Sign URL with Cloudinary (Mock implementation for now)
        // return cloudinary.url(media.url, { secure: true, sign_url: true, type: 'authenticated' });
        return { url: \`https://res.cloudinary.com/demo/image/upload/\${media.url}\`, title: media.title };
  }
}
