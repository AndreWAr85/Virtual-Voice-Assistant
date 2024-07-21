import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function listModels() {
  try {
    const models = await openai.models.list();
    console.log('Available models:', models);
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();

const app = express();
const PORT = process.env.PORT || 9001;

app.use(cors({ origin: 'http://localhost:9000' }));
app.use(bodyParser.json());

app.post('/api/speech', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('Received text:', text);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: text }],
      max_tokens: 150,
    });

    console.log('OpenAI response:', response);

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
