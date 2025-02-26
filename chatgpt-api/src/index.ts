// Basic ChatGPT API integration using openai package
import { Configuration, OpenAIApi } from 'openai';

async function askChatGPT(question: string) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: question,
    max_tokens: 100,
  });
  console.log('ChatGPT Response:', response.data.choices?.[0].text);
}

askChatGPT('What is Shift SlackBot?').catch(console.error);
