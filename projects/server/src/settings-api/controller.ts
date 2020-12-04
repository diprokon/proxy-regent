import * as WSWebSocket from 'ws';
import { WsAction, WsRequest } from '@prm/shared';
import { cache, CacheAction } from '../proxy-mock';
import { Api } from './api';
import { getApiAction } from './api-action';


export class Controller {
    private api = new Api((msg => this.send(msg)));

    constructor(private ws: WSWebSocket) {
        ws.on('close', () => this.destroy());
        ws.on('message', (msg: string) => {
            this.onRequest(JSON.parse(msg))
        });

        cache.addListener('update', this.storeUpdates);

        this.api.init();
    }

    send(msg: WsAction) {
        this.ws.send(JSON.stringify(msg));
    }

    onRequest({action, data}: WsRequest) {
        const apiActionProp = getApiAction(this.api, action);
        if (this.api[apiActionProp]) {
            this.api[apiActionProp](data);
        }
    }

    storeUpdates = (actions: CacheAction[]) => {
        this.api.storeUpdates(actions)
    }

    destroy() {
        cache.removeListener('update', this.storeUpdates);
    }
}
