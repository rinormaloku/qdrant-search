import { FastMCP } from "fastmcp";
import { z } from "zod";
import { OpenAI } from 'openai';


const embeddingModel: string = process.env.OPENAI_MODEL || "text-embedding-3-large";
// Define the collections as an enum-like value for Zod
const QdrantCollections = z.enum([
  "ambient",
  "argo",
  "argo-rollouts",
  "cilium",
  "gateway-api",
  "gloo-edge",
  "gloo-gateway",
  "gloo-mesh-core",
  "gloo-mesh-enterprise",
  "helm",
  "istio",
  "kgateway",
  "kubernetes",
  "otel",
  "prometheus",
  "github-gloo-mesh-enterprise",
  "github-istio",
  "github-solo-projects",
  "github-solo-reference-architectures",
]);

// Create the MCP serverfastmcp
const server = new FastMCP({
  name: "QdrantSearch Server",
  version: "1.0.0",
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Qdrant configuration
const qdrantUrl = process.env.QDRANT_URL || "https://qdrant.is.solo.io";
const qdrantApiKey = process.env.QDRANT_API_KEY;

// Interface for query results
interface QueryResult {
  id: string | number;
  score: number;
  payload: {
    content: string;
    url?: string;
    [key: string]: unknown;
  };
}

// Cache for Qdrant client
let qdrantClient: any | null = null;

// Function to get or initialize the Qdrant client
async function getQdrantClient(): Promise<any> {
  if (!qdrantClient) {
    try {
      const { QdrantClient } = await import("@qdrant/js-client-rest");
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

// Function to create embeddings using OpenAI
async function createEmbeddings(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: text,
  });
  return response.data[0]!.embedding;
}

// Function to query Qdrant
async function queryQdrant(
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

// Add the qdrantSearch tool to the MCP server
server.addTool({
  name: "qdrantSearch",
  description: "Searches a qdrant vector database collection",
  parameters: z.object({
    query: z.string().describe("The search query to use"),
    collection: QdrantCollections.describe("The name of the collection to search within"),
    limit: z.number().default(4).describe("Optional. The maximum number of search results to return. Defaults to 4. Use this to limit the amount of information returned."),
  }),
  // Add annotations for tool behavior
  annotations: {
    title: "Qdrant Vector Search",
    readOnlyHint: true,  // This tool doesn't modify anything
    openWorldHint: true, // Interacts with external system (Qdrant DB)
  },
  execute: async (args: any) => {
    try {
      // Get the Qdrant client
      const client = await getQdrantClient();

      // Create embeddings for the query
      const queryEmbedding = await createEmbeddings(args.query);

      // Perform the search in Qdrant
      const results = await queryQdrant(
        queryEmbedding,
        args.limit,
        args.collection,
        client
      );

      // Return the results as a string
      return JSON.stringify(results);
    } catch (error: any) {
      console.error("An error occurred during qdrant search:", error);

      // Return error in the format expected by MCP
      return JSON.stringify({
        error: `Failed to execute qdrant search: ${error.message || "Unknown error"}`,
      });
    }
  },
});

// Start the MCP server
server.start({
  transportType: "stdio",  // Using standard I/O for communication
});

// Export the server for potential use in other modules
export default server;