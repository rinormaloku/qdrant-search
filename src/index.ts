import { createServer } from "./server.js";

// Parse command line arguments for collections
// Expected format: --collections=collection1,collection2,collection3
const collectionsArg = process.argv.find(arg => arg.startsWith('--collections='));
const collections = collectionsArg
  ? collectionsArg.replace('--collections=', '').split(',')
  : [];

// Create a server with collections from arguments or defaults
const server = createServer({
  collections,
  transportType: "stdio",  // Using standard I/O for communication
});

server.start();