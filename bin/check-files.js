#!/usr/bin/env node
const argv = require('optimist')
    .usage('Usage: check-files -r file')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .alias('p', 'path')
    .describe('p', 'relative path')
    .alias('t', 'type')
    .describe('t', 'js css img')
    .argv;

let file_path = argv.file || 'index.html',
    www_root = argv.path || '.',
    file_type = argv.type;

require('../lib/index.js').find(file_path, www_root, file_type);
