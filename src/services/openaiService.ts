import openai, { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
};

const openaiInstance: OpenAI = new openai(configuration);

export const categorizeEmail = async (emailContent: string): Promise<string> => {
    try {
        const response: any = await openaiInstance.completions.create({
            model: 'text-davinci-004',
            prompt: `Categorize this email: ${emailContent}`,
            max_tokens: 50,
        });

        if (response && response.choices && response.choices.length > 0) {
            return response.choices[0].text.trim();
        } else {
            throw new Error('No valid response from OpenAI.');
        }
    } catch (error) {
        console.error('Error categorizing email with OpenAI:', error);
        throw new Error('Failed to categorize email.');
    }
};

export const generateReply = async (emailContent: string): Promise<string> => {
    try {
        const response: any = await openaiInstance.completions.create({
            model: 'text-davinci-004',
            prompt: `Generate a reply for this email: ${emailContent}`,
            max_tokens: 150,
        });

        if (response && response.choices && response.choices.length > 0) {
            return response.choices[0].text.trim();
        } else {
            throw new Error('No valid response from OpenAI.');
        }
    } catch (error) {
        console.error('Error generating reply with OpenAI:', error);
        throw new Error('Failed to generate reply.');
    }
};
