"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expressWS = require("express-ws");
const args_1 = require("./args");
const logger_1 = require("./logger");
const store_1 = require("./store");
const { app } = expressWS(express());
app.ws('/api', function (ws, req) {
    function json(key, data) {
        ws.send(JSON.stringify({ key, data }));
    }
    function onUpdates() {
        json('allKeys', store_1.cache.getAllKeys());
    }
    store_1.cache.addListener('updated', onUpdates);
    ws.on('message', function (msg) {
        const { action, data } = JSON.parse(msg);
        switch (action) {
            case 'allKeys':
                json('allKeys', store_1.cache.getAllKeys());
                break;
            case 'remove':
                store_1.cache.remove(data.key);
                break;
        }
    });
    ws.on('close', () => {
        store_1.cache.removeListener('updated', onUpdates);
    });
});
app.use(express.static('static'));
app.listen(args_1.args.settingsPort, () => {
    logger_1.say(`Settings panel: http://localhost:${args_1.args.settingsPort}`);
});
