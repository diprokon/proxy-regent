import * as WSWebSocket from 'ws';
import { cache } from '../proxy-mock';
import { WsActionModel } from '@prm/shared';
import { Api } from './api';
import { getApiAction } from './api-action';


export class Controller {
    private api = new Api((msg => this.send(msg)));

    constructor(private ws: WSWebSocket) {
        ws.on('close', () => this.destroy());
        ws.on('message', (msg: string) => {
            this.onRequest(JSON.parse(msg))
        });

        cache.addListener('updated', this.storeUpdates);

        this.api.init();
    }

    send(msg: WsActionModel) {
        this.ws.send(JSON.stringify(msg));
    }

    onRequest({action, data}: WsActionModel) {
        const apiActionProp = getApiAction(this.api, action);
        if (this.api[apiActionProp]) {
            this.api[apiActionProp](data);
        }
    }

    storeUpdates = () => {
        this.api.storeUpdates()
    }

    destroy() {
        cache.removeListener('updated', this.storeUpdates);
    }
}
