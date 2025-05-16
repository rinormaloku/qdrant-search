import { QueryResult } from "./types.js";
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL || "https://qdrant.is.solo.io";
const qdrantApiKey = process.env.QDRANT_API_KEY;

let qdrantClient: any | null = null;

export async function getQdrantClient(): Promise<any> {
  if (!qdrantClient) {
    try {
      qdrantClient = new QdrantClient({
        url: qdrantUrl,
        apiKey: qdrantApiKey,
        port: 443,
      });
    } catch (error) {
      console.error("Failed to load QdrantClient:", error);
      throw error;
    }
  }
  return qdrantClient;
}

export async function queryQdrant(
  queryEmbedding: number[],
  limit: number,
  collectionName: string,
  qdrantClient: any
): Promise<QueryResult[]> {
  const vector: number[] = queryEmbedding;

  const searchResult: Array<{ id: string | number; score: number; payload: any }> = await qdrantClient.search(collectionName, {
    vector,
    limit: limit,
    with_payload: true
  });

  return searchResult.map((item: { id: string | number; score: number; payload: any }) => ({
    id: item.id,
    score: item.score,
    payload: {
      content: item.payload.content as string,
      url: item.payload.url as string | undefined,
      ...item.payload
    }
  }));
}