import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ComplimentsService {
    private openai: OpenAI;
    private readonly logger = new Logger(ComplimentsService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        } else {
            this.logger.warn('OPENAI_API_KEY is not set. Compliment generation will not work.');
        }
    }

    async generate(interest: string): Promise<string[]> {
        if (!this.openai) {
            return [
                'You are glowing today! (API Key Missing)',
                'Your smile lights up the room! (API Key Missing)',
                'You are incredibly smart! (API Key Missing)',
                'You have the best taste! (API Key Missing)',
                'You are simply the best! (API Key Missing)',
            ];
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that generates compliments. Output structured JSON.',
                    },
                    {
                        role: 'user',
                        content: `Generate a Gen-Z style, sweet, and lowkey poetic compliments for my girlfriend who loves ${interest}. Return a JSON object with a key "compliments" containing the compliment.`,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('OpenAI returned empty content');
            }
            const result = JSON.parse(content);
            return result.compliments || [];
        } catch (error) {
            this.logger.error('Failed to generate compliments', error);
            throw error;
        }
    }
}
