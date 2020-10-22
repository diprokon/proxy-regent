import { RequestItem, WsActionModel } from '@prm/shared';
import { cache } from '../proxy-mock';
import { Action } from './api-action';

export class Api {
    constructor(private send: (msg: WsActionModel) => void) {
    }

    init() {
        this.send({
            action: 'state',
            data: cache.isActive
        });
    }

    storeUpdates() {
        this.allKeys();
    }

    @Action('allKeys')
    allKeys() {
        const allKeys: RequestItem[] = Array.from(cache.cache.entries())
            .map(([key, res]) => ({
                key,
                status: 'status' in res ? res.status : 200,
                skip: !!res.skip,
            }))

        this.send({
            action: 'allKeys',
            data: allKeys
        });
    }

    @Action('remove')
    remove(keys: string[]) {
        cache.remove(keys);
    }

    @Action('state')
    setState(state: boolean) {
        cache.isActive = state;
        this.send({
            action: 'state',
            data: cache.isActive
        })
    }

    @Action('skipKey')
    skipKey({keys, skip}: { keys: string[], skip: boolean }) {
        cache.skip(keys, skip);
    }
}
