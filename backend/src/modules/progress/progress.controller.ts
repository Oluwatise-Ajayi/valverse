import { Controller, Get, Patch, Body, UseGuards, Request, Post, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('progress')
export class ProgressController {
    constructor(private progressService: ProgressService) { }

    @Get()
    getProgress(@Request() req) {
        return this.progressService.getUserProgress(req.user.id);
    }

    @Patch('valentine')
    updateValentine(@Request() req, @Body('answer') answer: boolean) {
        return this.progressService.updateValentineAnswer(req.user.id, answer);
    }

    @Patch('quiz')
    updateQuiz(@Request() req, @Body('score') score: number) {
        return this.progressService.updateQuizScore(req.user.id, score);
    }

    @Post('game/:gameId')
    updateGameState(
        @Request() req,
        @Param('gameId') gameId: string,
        @Body() state: any,
    ) {
        return this.progressService.updateGameState(req.user.id, gameId, state);
    }
}
