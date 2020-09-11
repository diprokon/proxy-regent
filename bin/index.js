"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const httpProxy = require("http-proxy");
const fs_1 = require("fs");
const path_1 = require("path");
const store_1 = require("./store");
const logger_1 = require("./logger");
const args_1 = require("./args");
const port = parseInt(args_1.args.port, 10);
const configPath = path_1.join(process.cwd(), args_1.args.proxyConfig);
if (!args_1.args.proxyConfig || !fs_1.existsSync(configPath)) {
    logger_1.error('ProxyConfig not provided or file is not exists');
}
const proxyConfig = require(configPath);
logger_1.info('Starting....');
const proxy = httpProxy.createProxyServer();
proxy.on('proxyRes', (proxyRes, req, res) => {
    store_1.set(req, proxyRes);
});
const server = http.createServer((req, res) => {
    const cache = store_1.get(req, res);
    if (!cache) {
        logger_1.log(`-> ${req.url}`);
        proxy.web(req, res, proxyConfig);
    }
});
server.listen(port);
server.on('listening', () => logger_1.info(`Proxy listening: ${port}`));
server.on('error', console.error);
