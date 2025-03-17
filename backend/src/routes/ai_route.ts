import express, { Request, Response } from 'express';
    import { GoogleGenerativeAI } from "@google/generative-ai";
    import dotenv from 'dotenv';
    dotenv.config();

    const router = express.Router();

    const MODEL_NAME = "gemini-1.5-flash";
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in .env file');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    router.post('/generate-plan', async (req: Request, res: Response) => {
        console.log("Request received at /ai/generate-plan");
        console.log("Request body:", req.body);

    try {
    const { country, duration, cities, budget, interests } = req.body;
    const prompt = `Plan a trip to ${country} for ${duration} days. Visit ${cities}. Budget: ${budget} USD. Interests: ${interests.join(', ')}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ plan: text });
    } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
    }
    });

    export default router;