import { IncomingMessage } from 'http';
import * as express from 'express';
import * as HttpProxyServer from 'http-proxy';
import { cache, Res } from './store';
import { args, error, info, log, say } from '../shared';

export class ProxyMockServer {
    private port = parseInt(args.port, 10);
    private readonly target: string;
    private proxy = HttpProxyServer.createProxyServer();
    private server = express();

    constructor() {
        this.target = args.target;
        if (!this.target) {
            error('Please provide target url: -t <target>');
        }
    }

    start() {
        say('Starting....');

        this.proxy.on('proxyRes', async (proxyRes, req, res) => {
            const value = await this.getProxyData(req, proxyRes);
            cache.set(req.url, value);
        });

        this.server.use((req, res, next) => {
            const value = cache.get(req.url);
            if (!value) {
                next();
                return;
            }
            log(`from cache -> ${req.url}`);
            res
                .set(value.headers)
                .status(value.status)
                .send(value.data);
        });
        this.server.use((req, res) => {
            info(`-> ${req.url}`);
            this.proxy.web(req, res, {
                target: this.target,
                secure: false,
                autoRewrite: true,
                changeOrigin: true
            });
        });

        this.server
            .listen(this.port, () => {
                say(`Proxy listening: localhost:${this.port} -> ${this.target}`)
            });
    }

    private async getProxyData(req: IncomingMessage, proxyRes: IncomingMessage): Promise<Res> {
        return new Promise((resolve) => {
            const data = [];
            proxyRes.on('data', (d) => {
                data.push(d);
            });
            proxyRes.on('close', () => {
                resolve({
                    data: Buffer.concat(data).toString(),
                    headers: proxyRes.headers,
                    status: proxyRes.statusCode
                });
            });
        });
    }
}
