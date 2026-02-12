
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StoryNode, StoryChoice, PlayerStoryState } from '../../generated/client';

@Injectable()
export class StoryService {
    constructor(private prisma: PrismaService) { }

    // 1. Initialize or Get Current State
    async getPlayerState(userId: string) {
        let state = await this.prisma.playerStoryState.findUnique({
            where: { userId },
        });

        if (!state) {
            state = await this.prisma.playerStoryState.create({
                data: {
                    userId,
                    currentNodeId: "C1_S1",
                    choiceHistory: [],
                },
            });
        }
        return state;
    }

    // 2. Get Current Scene Content
    async getCurrentScene(userId: string) {
        const state = await this.getPlayerState(userId);

        const node = await this.prisma.storyNode.findUnique({
            where: { id: state.currentNodeId },
            include: { choices: true },
        });

        if (!node) {
            throw new NotFoundException(`Story node ${state.currentNodeId} not found`);
        }

        return {
            node,
            state: {
                trust: state.trust,
                closeness: state.closeness,
                security: state.security,
                desire: state.desire,
            }
        };
    }

    // 3. Make a Choice
    async makeChoice(userId: string, nodeId: string, choiceId: string) {
        const state = await this.getPlayerState(userId);

        if (state.currentNodeId !== nodeId) {
            throw new BadRequestException("You are not at this story node.");
        }

        const choice = await this.prisma.storyChoice.findUnique({
            where: { id: choiceId },
        });

        if (!choice || choice.nodeId !== nodeId) {
            throw new BadRequestException("Invalid choice for this node.");
        }

        // Apply stats
        const newTrust = state.trust + choice.trustDelta;
        const newCloseness = state.closeness + choice.closenessDelta;
        const newSecurity = state.security + choice.securityDelta;
        const newDesire = state.desire + choice.desireDelta;

        // Update history
        const history = (state.choiceHistory as any[]) || [];
        history.push({
            nodeId,
            choiceId,
            timestamp: new Date(),
        });

        // Determine Next Node
        let nextNodeId = choice.nextNodeId;

        // SPECIAL ROUTING LOGIC: If we are answering the "Continue" prompt on C5_ROUTE
        if (nodeId === 'C5_ROUTE') {
            nextNodeId = this.calculateEnding(newTrust, newCloseness, newSecurity, newDesire);
        }

        // Check if next node is an ENDING
        const isEnding = nextNodeId.startsWith('C5_END');

        // Update state
        await this.prisma.playerStoryState.update({
            where: { userId },
            data: {
                currentNodeId: nextNodeId,
                trust: newTrust,
                closeness: newCloseness,
                security: newSecurity,
                desire: newDesire,
                choiceHistory: history,
                isCompleted: isEnding,
                endingReached: isEnding ? nextNodeId : null,
            },
        });

        return this.getCurrentScene(userId);
    }

    // Helper: Logic to determine ending based on stats
    private calculateEnding(trust: number, closeness: number, security: number, desire: number): string {
        // ENDING 1: Soulmates (Requires high trust & closeness)
        if (trust >= 60 && closeness >= 60) {
            return 'C5_END1';
        }
        // ENDING 2: Quietly Strong (Good trust/security)
        else if (trust >= 50 && security >= 50) {
            return 'C5_END2';
        }
        // ENDING 4: Drift Apart (Low trust/closeness)
        else if (trust < 40 || closeness < 40) {
            return 'C5_END4';
        }

        // Default: Ending 3 (Almost)
        return 'C5_END3';
    }

    // Reset Story (New Game+)
    async resetStory(userId: string) {
        return this.prisma.playerStoryState.update({
            where: { userId },
            data: {
                currentNodeId: "C1_S1",
                trust: 50,
                closeness: 50,
                security: 50,
                desire: 50,
                choiceHistory: [],
                isCompleted: false,
                endingReached: null,
            }
        });
    }
}
