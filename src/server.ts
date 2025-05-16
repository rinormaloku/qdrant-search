import { FastMCP } from "fastmcp";
import { z } from "zod";
import { QdrantCollections } from "./collections.js";
import { getQdrantClient, queryQdrant } from "./qdrantClient.js";
import { createEmbeddings } from "./openaiClient.js";

const server = new FastMCP({
  name: "QdrantSearch Server",
  version: "1.0.0",
});

server.addTool({
  name: "qdrantSearch",
  description: "Searches a qdrant vector database collection",
  parameters: z.object({
    query: z.string().describe("The search query to use"),
    collection: QdrantCollections.describe("The name of the collection to search within"),
    limit: z.number().default(4).describe("Optional. The maximum number of search results to return. Defaults to 4. Use this to limit the amount of information returned."),
  }),
  annotations: {
    title: "Qdrant Vector Search",
    readOnlyHint: true,
    openWorldHint: true,
  },
  execute: async (args: any) => {
    try {
      const client = await getQdrantClient();
      const queryEmbedding = await createEmbeddings(args.query);
      const results = await queryQdrant(
        queryEmbedding,
        args.limit,
        args.collection,
        client
      );
      return JSON.stringify(results);
    } catch (error: any) {
      console.error("An error occurred during qdrant search:", error);
      return JSON.stringify({
        error: `Failed to execute qdrant search: ${error.message || "Unknown error"}`,
      });
    }
  },
});

export default server;