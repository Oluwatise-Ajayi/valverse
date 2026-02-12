import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ComplimentsService } from '../src/modules/compliments/compliments.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const service = app.get(ComplimentsService);

    console.log('Testing Compliment Generation for interest: "Anime"');
    try {
        const compliments = await service.generate('Anime');
        console.log('Result:', JSON.stringify(compliments, null, 2));
    } catch (error) {
        console.error('Verification Failed:', error);
    }

    await app.close();
}

bootstrap();
