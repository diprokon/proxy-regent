import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { existsSync } from 'fs';
import { join } from 'path';
import { get, set } from './store';
import { error, info, log } from './logger';
import { args } from './args';

const port = parseInt(args.port, 10);
const configPath = join(process.cwd(), args.proxyConfig);

if (!args.proxyConfig || !existsSync(configPath)) {
    error('ProxyConfig not provided or file is not exists');
}

const proxyConfig = require(configPath);
info('Starting....');
const proxy = httpProxy.createProxyServer();

proxy.on('proxyRes', (proxyRes, req, res) => {
    set(req, proxyRes);
});

const server = http.createServer((req, res) => {
    const cache = get(req, res);
    if (!cache) {
        log(`-> ${req.url}`);
        proxy.web(req, res, proxyConfig);
    }
});
server.listen(port);
server.on('listening', () => info(`Proxy listening: ${port}`));
server.on('error', console.error);


