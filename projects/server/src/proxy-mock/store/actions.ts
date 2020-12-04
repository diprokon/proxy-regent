import { ResponseObject } from './response-object.model';
import { ActionType } from '@prm/shared';

export interface CacheAction {
    type: ActionType;
    item: ResponseObject;
}

export interface CacheEvents {
    init: () => void
    update: (actions: CacheAction[]) => void
}
