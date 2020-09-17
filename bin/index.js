"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const httpProxy = require("http-proxy");
const store_1 = require("./store");
const logger_1 = require("./logger");
const args_1 = require("./args");
require("./settings-server");
const port = parseInt(args_1.args.port, 10);
const target = args_1.args.target;
if (!target) {
    logger_1.error('Please provide target url: -t <target>');
}
logger_1.say('Starting....');
const proxy = httpProxy.createProxyServer();
proxy.on('proxyRes', (proxyRes, req, res) => {
    if (store_1.cache.isActive) {
        store_1.set(req, proxyRes);
    }
});
const server = http.createServer((req, res) => {
    if (store_1.cache.isActive && store_1.get(req, res)) {
        logger_1.log(`from cache -> ${req.url}`);
    }
    else {
        logger_1.info(`-> ${req.url}`);
        proxy.web(req, res, {
            target,
            secure: false,
            autoRewrite: true,
            changeOrigin: true
        });
    }
});
server.listen(port);
server.on('listening', () => logger_1.say(`Proxy listening: localhost:${port} -> ${target}`));
server.on('error', console.error);
