import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ComplimentsService {
    private genAI: GoogleGenerativeAI;
    private readonly logger = new Logger(ComplimentsService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        } else {
            this.logger.warn('GEMINI_API_KEY is not set. Compliment generation will be limited.');
        }
    }

    async generate(interest: string, count: number = 10): Promise<string[]> {
        this.logger.log(`Attempting to generate ${count} compliments for interest: "${interest}"`);

        if (!this.genAI) {
            this.logger.warn('Gemini client not initialized (API Key missing). Returning existing fallbacks.');
            return Array(count).fill('You are amazing! (API Key Missing)');
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const prompt = `
            Generate ${count} unique, Gen-Z style, sweet, and lowkey poetic compliments for my girlfriend who loves "${interest}".
            
            Return ONLY a valid JSON object with a single key "compliments" which is an array of strings.
            Do not include markdown code blocks.
            Example: { "compliments": ["You're the main character in my life", "Your vibe checks out perfectly"] }
            `;

            this.logger.log('Sending prompt to Gemini...');
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            this.logger.log('Received response from Gemini.');
            this.logger.debug(`Raw response: ${responseText}`);

            // Clean up potentially markdown-wrapped JSON
            const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(jsonString);

            if (parsed.compliments && Array.isArray(parsed.compliments)) {
                this.logger.log(`Successfully parsed ${parsed.compliments.length} compliments.`);
                return parsed.compliments;
            } else {
                this.logger.warn('Parsed JSON did not contain "compliments" array', parsed);
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            this.logger.error('Failed to generate compliments with Gemini', error);
            // Fallback compliments
            return [
                `Your smile outshines any ${interest}`,
                `You make ${interest} look even cooler`,
                "You're the main character energy I need",
                "No cap, you're perfect",
                "Living rent-free in my mind 24/7"
            ];
        }
    }
}
