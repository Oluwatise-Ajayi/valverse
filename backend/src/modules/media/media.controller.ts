import { Controller, Get, Param, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Helper for unique filenames
const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    // Get rewards for a specific game
    @Get('game/:gameId')
    async getGameRewards(@Param('gameId') gameId: string) {
        return this.mediaService.getRewardsByGame(gameId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('vault')
    async getUserVault(@Request() req) {
        return this.mediaService.getUserUploads(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads', // Ensure this directory exists!
            filename: editFileName,
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        const userId = req.user.userId;
        // Determine type based on mimetype
        const mime = file.mimetype.split('/')[0].toUpperCase();
        let type: 'IMAGE' | 'VIDEO' | 'AUDIO' = 'IMAGE';
        if (mime === 'AUDIO') type = 'AUDIO';
        if (mime === 'VIDEO') type = 'VIDEO';

        // URL construction - assumes static files served from /uploads
        // In production, this should be Cloudinary URL
        const fileUrl = `/uploads/${file.filename}`;

        return this.mediaService.saveUserUpload(userId, file.originalname, fileUrl, type);
    }
}
