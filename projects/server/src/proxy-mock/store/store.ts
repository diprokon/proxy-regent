import { existsSync, mkdirSync, promises, writeFile } from 'fs';
import { dirname, join } from 'path';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter'
import { ActionType } from '@prm/shared';
import { args } from '../../shared';
import { CacheEvents } from './actions';
import { ResponseObject } from './response-object.model';

interface CacheFileData {
    settings: {
        isActive: boolean;
        skipKeys: string[];
    }
    cache: ResponseObject[]
}

const skippedHeaders = [
    'set-cookie',
];

class Cache extends (EventEmitter as new () => TypedEmitter<CacheEvents>) {
    public isActive = true;

    cache: Map<string, ResponseObject>;
    private filePath = join(process.cwd(), args.cachePath);

    private skipKeys: { [key: string]: boolean } = {};

    constructor() {
        super();
        promises.access(this.filePath)
            .then(() => promises.readFile(this.filePath))
            .then((savedCache) => {
                if (savedCache) {
                    return JSON.parse(savedCache.toString()) as CacheFileData;
                }
            })
            .catch(() => {})
            .then((savedCache) => {
                this.cache = new Map<string, ResponseObject>(savedCache && savedCache.cache ? savedCache.cache.map(c => ([c.key, c])) : []);
                if (savedCache) {
                    this.isActive = !!savedCache.settings?.isActive;
                }
                Array.from(this.cache.entries())
                    .forEach(([key, res]) => {
                        this.skipKeys[key] = !!res.skip || savedCache && savedCache?.settings?.skipKeys.includes(key);
                    });
                this.emit('init');
            });
    }

    get(key: string): ResponseObject {
        if (
            !this.isActive
            || !this.cache.has(key)
            || this.skipKeys[key]
        ) {
            return null;
        }
        return this.cache.get(key);
    }

    set(key: string, value: ResponseObject) {
        skippedHeaders.forEach(header => {
            delete value.headers[header];
        });
        const isNew = !this.cache.has(key);
        if (!isNew) {
            const oldValue = this.cache.get(key);
            value.skip = oldValue.skip;
        }
        this.cache.set(key, value);
        this.write();
        this.emit('update', [{
            type: isNew ? ActionType.ADDED : ActionType.MODIFIED,
            item: value
        }]);
    }

    remove(keys: string[]) {
        const actions = keys.map(key => ({
            type: ActionType.REMOVED,
            item: this.cache.get(key)
        }));
        keys.forEach(key => this.cache.delete(key));
        this.write();
        this.emit('update', actions);
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
        this.emit('update', keys
            .map(key => ({
                    type: ActionType.MODIFIED,
                    item: this.cache.get(key)
                })
            ));
    }

    setIsActive(isActive: boolean) {
        this.isActive = isActive;
    }

    private write() {
        const res = {
            settings: {
                isActive: this.isActive,
                skipKeys: Object.keys(this.skipKeys).filter(key => this.skipKeys[key])
            },
            cache: Array.from(this.cache.values())
        };
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

export const cache = new Cache();

