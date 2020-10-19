import * as http from 'http';
import * as HttpProxyServer from 'http-proxy';
import { cache, get, set } from './store';
import { args, error, info, log, say } from '../shared';

export class ProxyMockServer {
    private port = parseInt(args.port, 10);
    private readonly target: string;
    private proxy: HttpProxyServer;

    constructor() {
        this.target = args.target;
        if (!this.target) {
            error('Please provide target url: -t <target>');
        }

    }

    start() {
        say('Starting....');
        this.proxy = HttpProxyServer.createProxyServer();

        this.proxy.on('proxyRes', (proxyRes, req, res) => {
            if (cache.isActive) {
                set(req, proxyRes);
            }
        });

        const server = http.createServer((req, res) => {
            if (cache.isActive && get(req, res)) {
                log(`from cache -> ${req.url}`);
            } else {
                info(`-> ${req.url}`);
                this.proxy.web(req, res, {
                    target: this.target,
                    secure: false,
                    autoRewrite: true,
                    changeOrigin: true
                });
            }
        });
        server.listen(this.port);
        server.on('listening', () => say(`Proxy listening: localhost:${this.port} -> ${this.target}`));
        server.on('error', console.error);

    }
}
