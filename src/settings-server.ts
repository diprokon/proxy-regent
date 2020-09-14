import * as express from 'express';
import * as expressWS from 'express-ws';
import { args } from './args';
import { say } from './logger';
import { cache } from './store';
import { join } from 'path';

const { app } = expressWS(express());


app.ws('/api', function (ws, req) {
    function json(key: string, data: any) {
        ws.send(JSON.stringify({ key, data }));
    }

    function onUpdates() {
        json('allKeys', cache.getAllKeys());
    }

    cache.addListener('updated', onUpdates);

    ws.on('message', function (msg: string) {
        const { action, data } = JSON.parse(msg);
        switch (action) {
            case 'allKeys':
                json('allKeys', cache.getAllKeys());
                break;
            case 'remove':
                cache.remove(data.key);
                break;
        }
    });
    ws.on('close', () => {
        cache.removeListener('updated', onUpdates);
    });
});

app.use(express.static(join(__dirname, '../static')));

app.listen(args.settingsPort, () => {
    say(`Settings panel: http://localhost:${args.settingsPort}`);
});
