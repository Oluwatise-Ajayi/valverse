import { Controller, Get, Param, Post, UseInterceptors, UploadedFile, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

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
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.mediaService.saveUserUpload(req.user.userId, file);
    }
}
