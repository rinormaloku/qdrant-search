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
  })
  .option('name', {
    type: 'string',
    description: 'Name for the MCP tool',
  })
  .option('description', {
    type: 'string',
    description: 'Description for the MCP tool',
  })
  .parseSync();

const collections = argv.collections ? argv.collections.split(',') : [];
const { name, description } = argv;

const server = createServer({
  collections,
  name,
  description,
  transportType: "stdio",
});

server.start();