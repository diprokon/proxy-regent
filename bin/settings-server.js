"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expressWS = require("express-ws");
const args_1 = require("./args");
const logger_1 = require("./logger");
const store_1 = require("./store");
const path_1 = require("path");
const { app } = expressWS(express());
function getAllKeys() {
    return Array.from(store_1.cache.cache.entries()).map(([key, res]) => ({ key, status: res.status }));
}
app.ws('/api', function (ws, req) {
    function json(key, data) {
        ws.send(JSON.stringify({ key, data }));
    }
    function onUpdates() {
        json('allKeys', getAllKeys());
    }
    store_1.cache.addListener('updated', onUpdates);
    ws.on('message', function (msg) {
        const { action, data } = JSON.parse(msg);
        switch (action) {
            case 'allKeys':
                json('allKeys', getAllKeys());
                break;
            case 'remove':
                store_1.cache.remove(data.key);
                break;
            case 'toggleState':
                store_1.cache.isActive = data;
                json('state', store_1.cache.isActive);
                break;
        }
    });
    ws.on('close', () => {
        store_1.cache.removeListener('updated', onUpdates);
    });
    json('state', store_1.cache.isActive);
});
app.use(express.static(path_1.join(__dirname, '../static')));
app.listen(args_1.args.settingsPort, () => {
    logger_1.say(`Settings panel: http://localhost:${args_1.args.settingsPort}`);
});
