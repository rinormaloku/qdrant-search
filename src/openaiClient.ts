import { OpenAI } from 'openai';

const embeddingModel: string = process.env.OPENAI_MODEL || "text-embedding-3-large";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbeddings(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: text,
  });
  return response.data[0]!.embedding;
}