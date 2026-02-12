import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('media')
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @Get()
    findAll() {
        return this.mediaService.findAll();
    }

    @Get(':id/sign')
    getSignedUrl(@Request() req, @Param('id') id: string) {
        return this.mediaService.getSignedUrl(req.user.id, id);
    }

    @Get('game/:gameId')
    getMediaByGame(@Param('gameId') gameId: string) {
        return this.mediaService.getMediaByGame(gameId);
    }
}
