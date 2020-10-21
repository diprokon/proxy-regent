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
                checked: !!res.checked,
            }))

        this.send({
            action: 'allKeys',
            data: allKeys
        });
    }

    @Action('remove')
    remove(key: string) {
        cache.remove(key);
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
    skipKey({key, skip}: { key: string, skip: boolean }) {
        cache.skip(key, skip);
    }

    @Action('checkedKey')
    checkedKey({key, checked}: { key: string, checked: boolean }) {
        !key
            ? cache.cache.forEach(key => key.checked = checked)
            : cache.cache[key].checked = checked;
        this.send({
            action: 'checkedKey',
            data: cache.isActive
        })
    }
}
