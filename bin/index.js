"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const httpProxy = require("http-proxy");
const store_1 = require("./store");
const logger_1 = require("./logger");
const args_1 = require("./args");
const port = parseInt(args_1.args.port, 10);
const target = args_1.args.target;
if (!target) {
    logger_1.error('Please provide target url: -t <target>');
}
logger_1.info('Starting....');
const proxy = httpProxy.createProxyServer();
proxy.on('proxyRes', (proxyRes, req, res) => {
    store_1.set(req, proxyRes);
});
const server = http.createServer((req, res) => {
    const cache = store_1.get(req, res);
    if (!cache) {
        logger_1.info(`-> ${req.url}`);
        proxy.web(req, res, {
            target,
            secure: false,
            autoRewrite: true,
            changeOrigin: true
        });
    }
    else {
        logger_1.log(`from cache -> ${req.url}`);
    }
});
server.listen(port);
server.on('listening', () => logger_1.info(`Proxy listening: localhost:${port} -> ${target}`));
server.on('error', console.error);
