import { ActionType, RequestItem, UpdatedItem, WsAction, WsActions, WsRequests, WsSkipRequestModel } from '@prm/shared';
import { cache, CacheAction, ResponseObject } from '../proxy-mock';
import { Action } from './api-action';

function responseObjectToRequestItem(item: ResponseObject): RequestItem {
    return {
        key: item.key,
        skip: !!item.skip,
        status: item.status,
    };
}

export class Api {
    constructor(private send: (msg: WsAction) => void) {
    }

    init() {
        this.send({
            action: WsActions.STATE,
            data: cache.isActive
        });

        const allKeys: UpdatedItem[] = Array.from(cache.cache.values())
            .map(res => ({
                type: ActionType.ADDED,
                item: responseObjectToRequestItem(res)
            }));

        this.send({
            action: WsActions.UPDATE,
            data: allKeys
        });
    }

    storeUpdates(actions: CacheAction[]) {
        this.send({
            action: WsActions.UPDATE,
            data: actions.map(a => ({
                type: a.type,
                item: responseObjectToRequestItem(a.item)
            }))
        })
    }

    @Action(WsRequests.REMOVE)
    remove(keys: string[]) {
        cache.remove(keys);
    }

    @Action(WsRequests.STATE)
    setState(state: boolean) {
        cache.setIsActive(state);
        this.send({
            action: WsActions.STATE,
            data: cache.isActive
        })
    }

    @Action(WsRequests.SKIP)
    skipKey({keys, skip}: WsSkipRequestModel) {
        cache.skip(keys, skip);
    }
}
