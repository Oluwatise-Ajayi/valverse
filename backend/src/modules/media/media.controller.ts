import { Controller, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    // Get rewards for a specific game
    @Get('game/:gameId')
    async getGameRewards(@Param('gameId') gameId: string) {
        return this.mediaService.getRewardsByGame(gameId);
    }
}
