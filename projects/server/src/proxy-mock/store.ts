import { OutgoingHttpHeaders } from 'http';
import { existsSync, mkdirSync, readFile, writeFile } from 'fs';
import { dirname, join } from 'path';
import { EventEmitter } from 'events';
import { args } from '../shared';

export interface Res {
    data: string;
    headers: OutgoingHttpHeaders;
    status: number;
    skip?: boolean;
}

const skippedHeaders = [
    'set-cookie',
];

class Cache extends EventEmitter {
    public isActive = true;

    cache: Map<string, Res>;
    private filePath = join(process.cwd(), args.mockPath);

    private skipKeys: { [key: string]: boolean } = {};

    constructor() {
        super();
        readFile(this.filePath, (err, data) => {
            let v;
            if (data) {
                v = data.toString();
            }
            this.cache = new Map<string, Res>(v ? Object.entries(JSON.parse(v)) : []);
            Array.from(this.cache.entries())
                .forEach(([key, res]) => {
                    this.skipKeys[key] = !!res.skip;
                });
            this.emit('inited');
        });
    }

    get(key: string): Res {
        if (
            !this.isActive
            || !this.cache.has(key)
            || this.skipKeys[key]
        ) {
            return null;
        }
        return this.cache.get(key);
    }

    set(key: string, value: Res) {
        skippedHeaders.forEach(header => {
            delete value.headers[header];
        });
        this.cache.set(key, value);
        this.write();
    }

    remove(keys: string[]) {
        keys.forEach(key => this.cache.delete(key));
        this.write();
    }

    skip(keys: string[], skip: boolean) {
        keys.forEach(key => {
            if (!this.cache.has(key)) {
                return;
            }
            this.cache.get(key).skip = skip;
            this.skipKeys[key] = skip;
        })
        this.write();
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

            this.emit('updated');
        });
    }
}

export const cache = new Cache();

