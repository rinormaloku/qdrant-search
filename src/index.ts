import server from "./server.js";

server.start({
  transportType: "stdio",  // Using standard I/O for communication
});