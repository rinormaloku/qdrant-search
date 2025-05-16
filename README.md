# Qdrant Search MCP Server

A Model Context Protocol (MCP) server for enhanced Qdrant vector database functionality. This server provides a tool for searching the Qdrant vector database.

## Features

- **qdrantSearch** (default): Searches a Qdrant vector database collection — name and description can be overridden via `--name` and `--description` flags

## Installation

You can use it directly with `npx` without global installation:

```bash
npx qdrant-search-mcp-server
```

### Configuring with `npx`

When using `npx`, the server will load configuration from a `.env` file in the current directory if present. You can configure these environment variables:

```
QDRANT_URL=https://qdrant.is.solo.io
QDRANT_API_KEY=add your key

# As long as the embedding service is openai api compatible, you can use them also.
OPENAI_API_KEY=add your key
OPENAI_ENDPOINT=https://api.openai.com/v1
OPENAI_MODEL=text-embedding-3-large
```

Meanwhile, collections are provided directly in the command line, or the defaults will be used if nothing is specified.

```bash
npx qdrant-search-mcp-server --collections=istio,gloo-mesh-enterprise
```

Additionally, you can customize the MCP tool metadata at launch:

```bash
npx qdrant-search-mcp-server \
  --collections=istio,gloo-mesh-enterprise \
  --name=mySearchTool \
  --description="Custom Qdrant search tool"  # override default name/description
```

## Usage with Claude

To use this MCP server with Claude, add it to your MCP settings configuration file:

```json
{
  "mcpServers": {
    "qdrantSearch": {
      "command": "npx",
      "args": ["qdrant-search-mcp-server --collections=istio,gloo-mesh-enterprise --name=mySearchTool --description='Search Documentation related to Istio and Gloo Mesh'"],
      "env": {
        "QDRANT_URL": "http://localhost:6333",
        "QDRANT_API_KEY": "your_api_key",
        "OPENAPI_API_KEY": "your_api_key",
      }
    }
  }
}
```

## Usage with Visual Studio Code

To use this MCP server with Visual Studio Code, you can add it to your `mcp.json` configuration file. Below is an example configuration:

```json
{
  "servers": {
    "qdrantSearch": {
      "command": "npx",
      "args": ["qdrant-search-mcp-server"],
      "env": {
        "QDRANT_URL": "http://localhost:6333",
        "QDRANT_API_KEY": "your_api_key",
        "OPENAPI_API_KEY": "your_api_key",
      }
    }
  }
}
```

#### qdrantSearch

```
use_mcp_tool
server_name: qdrantSearch
tool_name: qdrantSearch
arguments: {
  "query": "your search query",
  "collection": "my-collection",
  "limit": 5
}
```
