"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = exports.cache = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const args_1 = require("./args");
const events_1 = require("events");
class Cache extends events_1.EventEmitter {
    constructor() {
        super();
        this.filePath = path_1.join(process.cwd(), args_1.args.mockPath);
        this.skip = [
            /api\/testlogin/,
        ];
        fs_1.readFile(this.filePath, (err, data) => {
            let v;
            if (data) {
                v = data.toString();
            }
            this.cache = new Map(v ? Object.entries(JSON.parse(v)) : []);
            this.emit('inited');
        });
    }
    get(req) {
        if (this.skip.some(regExp => regExp.test(req.url))) {
            return null;
        }
        const key = this.getKey(req);
        if (!this.cache.has(key)) {
            return null;
        }
        return this.cache.get(key);
    }
    set(req, value) {
        this.cache.set(this.getKey(req), value);
        this.write();
    }
    remove(key) {
        this.cache.delete(key);
        this.write();
    }
    getAllKeys() {
        return Array.from(this.cache.keys());
    }
    getKey(req) {
        return `${req.url}`;
    }
    write() {
        const res = {};
        this.cache.forEach((v, k) => {
            res[k] = v;
        });
        if (!fs_1.existsSync(path_1.dirname(this.filePath))) {
            fs_1.mkdirSync(path_1.dirname(this.filePath));
        }
        fs_1.writeFile(this.filePath, JSON.stringify(res), (err) => {
            if (err) {
                console.error(err);
            }
            this.emit('updated');
        });
    }
}
exports.cache = new Cache();
function get(req, res) {
    const value = exports.cache.get(req);
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
exports.get = get;
function set(req, proxyRes) {
    const data = [];
    proxyRes.on('data', (d) => {
        data.push(d);
    });
    proxyRes.on('close', (arr) => {
        exports.cache.set(req, {
            data: Buffer.concat(data).toString(),
            headers: proxyRes.headers
        });
    });
}
exports.set = set;
