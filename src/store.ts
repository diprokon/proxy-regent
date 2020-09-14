import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import { existsSync, mkdirSync, readFile, writeFile } from 'fs';
import { dirname, join } from 'path';
import { args } from './args';

export interface Res {
    data: string;
    headers: OutgoingHttpHeaders;
}

class Cache {
    private cache: Map<string, Res>;
    private filePath = join(process.cwd(), args.mockPath);

    private skip: RegExp[] = [
        /api\/testlogin/,
    ];

    constructor() {
        readFile(this.filePath, (err, data) => {
            let v;
            if (data) {
                v = data.toString();
            }
            this.cache = new Map<string, Res>(v ? Object.entries(JSON.parse(v)) : []);
        });
    }

    get(req: IncomingMessage): Res {
        if (this.skip.some(regExp => regExp.test(req.url))) {
            return null;
        }
        const key = this.getKey(req);
        if (!this.cache.has(key)) {
            return null;
        }
        return this.cache.get(key);
    }

    set(req: IncomingMessage, value: Res) {
        this.cache.set(this.getKey(req), value);
        this.write();
    }

    private getKey(req: IncomingMessage): string {
        return `${req.url}`;
    }

    private write() {
        const res = {};
        this.cache.forEach((v, k) => {
            res[k] = v;
        });
        if (!existsSync(dirname(this.filePath))) {
            mkdirSync(dirname(this.filePath));
        }
        writeFile(this.filePath, JSON.stringify(res), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}

const cache = new Cache();

export function get(req: IncomingMessage, res: ServerResponse): boolean {
    const value = cache.get(req);
    if (!value) {
        return false;
    }
    Object.keys(value.headers)
        .forEach(k => {
            res.setHeader(k, value.headers[k]);
        });
    res.write(value.data);
    res.end();
    return true;
}

export function set(req: IncomingMessage, proxyRes: IncomingMessage): void {
    const data = [];
    proxyRes.on('data', (d) => {
        data.push(d);
    });
    proxyRes.on('close', (arr) => {
        cache.set(req, {
            data: Buffer.concat(data).toString(),
            headers: proxyRes.headers
        });
    });
}
