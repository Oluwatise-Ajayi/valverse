import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let app;

export default async function handler(req, res) {
    if (!app) {
        app = await NestFactory.create(AppModule);

        // Enable CORS for Vercel
        app.enableCors({
            origin: [
                process.env.FRONTEND_URL,
                'http://localhost:3000'
            ].filter(Boolean),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        });

        await app.init();
    }

    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
}
