import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateMediaRewardDto } from './dto/create-media-reward.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Get all media rewards
    @Get('media')
    async getAllMedia() {
        return this.adminService.getAllMedia();
    }

    // Create a text/compliment reward (no file upload)
    @Post('media/text')
    async createTextReward(@Body() dto: CreateMediaRewardDto) {
        if (dto.type !== 'TEXT' && dto.type !== 'COMPLIMENT') {
            throw new BadRequestException('This endpoint is only for TEXT and COMPLIMENT types');
        }
        return this.adminService.createMediaReward(dto);
    }

    // Create media reward with file upload (IMAGE, VIDEO, AUDIO)
    @Post('media/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadMediaReward(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateMediaRewardDto
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.adminService.uploadMediaReward(file, dto);
    }

    // Delete a media reward
    @Delete('media/:id')
    async deleteMedia(@Param('id') id: string) {
        return this.adminService.deleteMedia(id);
    }

    // Get media by game
    @Get('media/game/:gameId')
    async getMediaByGame(@Param('gameId') gameId: string) {
        return this.adminService.getMediaByGame(gameId);
    }
}
