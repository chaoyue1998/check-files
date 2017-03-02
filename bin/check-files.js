#!/usr/bin/env node
const argv = require('optimist')
    .usage('Usage: check-files -r file')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .alias('r', 'root')
    .describe('r', 'root directory')
    .alias('t', 'type')
    .describe('t', 'js css img')
    .argv;

let file_path = argv.file || 'index.html',
    www_root = argv.root || '.',
    file_type = argv.type;

require('../lib/index.js').uploadCdn(file_path, www_root, file_type);
