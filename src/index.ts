#!/usr/bin/env node

// @ts-ignore
process.noDeprecation = true;

import { createServer } from "./server.js";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('collections', {
    type: 'string',
    description: 'Comma-separated list of collections to search',
    default: process.env.COLLECTIONS,
  })
  .option('name', {
    type: 'string',
    description: 'Name for the MCP tool',
    default: process.env.TOOL_NAME,
  })
  .option('description', {
    type: 'string',
    description: 'Description for the MCP tool',
    default: process.env.TOOL_DESCRIPTION,
  })
  .parseSync();

const collections = argv.collections ? argv.collections.split(',') : [];
const { name, description } = argv;

const server = createServer({
  collections,
  name,
  description,
});

server.start({
  httpStream: {
    port: 8080,
  },
  transportType: "httpStream",
});