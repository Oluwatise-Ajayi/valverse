
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StoryService } from './story.service';

@Controller('story')
@UseGuards(AuthGuard('jwt'))
export class StoryController {
    constructor(private storyService: StoryService) { }

    @Get('current')
    async getCurrentScene(@Request() req) {
        // req.user might be attached by passport, usually { userId: string, ... }
        // Let's assume req.user.id or req.user.userId based on your Auth implementation
        // From AuthController 'me', it returns req.user directly.
        // Assuming user object has .id or .userId based on login payload.
        // Usually, passport strategys attach the user object.
        // Let's assume `req.user.userId` or just `req.user.id`
        // If the User model has id (uuid), let's use id.
        return this.storyService.getCurrentScene(req.user.userId || req.user.id);
    }

    @Post('choice')
    async makeChoice(@Request() req, @Body('nodeId') nodeId: string, @Body('choiceId') choiceId: string) {
        return this.storyService.makeChoice(req.user.userId || req.user.id, nodeId, choiceId);
    }

    @Post('reset')
    async resetStory(@Request() req) {
        return this.storyService.resetStory(req.user.userId || req.user.id);
    }
}
