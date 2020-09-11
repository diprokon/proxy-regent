"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.args = void 0;
const commander_1 = require("commander");
exports.args = new commander_1.Command();
exports.args
    .option('-c, --proxyConfig <proxyConfig>', 'Path to http-proxy config file')
    .option('-m, --mockPath [mockPath]', 'Path to cache file', 'tmp/mock-data.json')
    .option('-p, --port [port]', 'Port (default 3003)', '3003')
    .option('-v, --verbose')
    .parse(process.argv);
