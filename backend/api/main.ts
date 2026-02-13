import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

import * as path from 'path';

let app;

export default async function handler(req, res) {
    try {
        if (!app) {
            app = await NestFactory.create(AppModule);
            app.enableCors({
                origin: [process.env.FRONTEND_URL, 'http://localhost:3000'].filter(Boolean),
                credentials: true,
            });
            await app.init();
        }

        const expressApp = app.getHttpAdapter().getInstance();
        return expressApp(req, res);
    } catch (err) {
        console.error("CRITICAL ERROR DURING INIT:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
}