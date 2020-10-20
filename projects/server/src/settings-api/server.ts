import * as express from 'express';
import * as expressWS from 'express-ws';
import { args, say } from '../shared';
import { join } from 'path';
import { Controller } from './controller';

const {app} = expressWS(express());

export class SettingsApiServer {
    start() {
        app.ws('/api', (ws, req) => {
            const controller = new Controller(ws);
        });
        app.use(express.static(join(__dirname, '../../../client')));

        app.listen(args.settingsPort, () => {
            say(`Settings panel: http://localhost:${args.settingsPort}`);
        });
    }
}

