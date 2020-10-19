import { WsMessageModel } from '@prm/shared';
import { cache } from '../proxy-mock';
import { Action } from './api-action';

function getAllKeys() {
    return Array.from(cache.cache.entries()).map(([key, res]) => ({key, status: 'status' in res ? res.status : 200}));
}

export class Api {
    constructor(private send: (msg: WsMessageModel) => void) {
    }

    init() {
        this.send({
            action: 'state',
            data: cache.isActive
        });
    }

    storeUpdates() {
        this.send({
            action: 'allKeys',
            data: getAllKeys()
        });
    }

    @Action('allKeys')
    allKeys() {
        this.send({
            action: 'allKeys',
            data: getAllKeys()
        });
    }

    @Action('remove')
    remove(key: string) {
        cache.remove(key);
    }

    @Action('toggleState')
    toggleState(state: boolean) {
        cache.isActive = state;
        this.send({
            action: 'state',
            data: cache.isActive
        })
    }
}
