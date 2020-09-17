import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { cache, get, set } from './store';
import { error, info, log, say } from './logger';
import { args } from './args';

import './settings-server';

const port = parseInt(args.port, 10);
const target = args.target;
if (!target) {
    error('Please provide target url: -t <target>');
}

say('Starting....');
const proxy = httpProxy.createProxyServer();

proxy.on('proxyRes', (proxyRes, req, res) => {
    if (cache.isActive) {
        set(req, proxyRes);
    }
});

const server = http.createServer((req, res) => {
    if (cache.isActive && get(req, res)) {
        log(`from cache -> ${req.url}`);
    } else {
        info(`-> ${req.url}`);
        proxy.web(req, res, {
            target,
            secure: false,
            autoRewrite: true,
            changeOrigin: true
        });
    }
});
server.listen(port);
server.on('listening', () => say(`Proxy listening: localhost:${port} -> ${target}`));
server.on('error', console.error);


