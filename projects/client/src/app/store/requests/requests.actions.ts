import { RequestItem } from '@prm/shared';
import { WsRequestAction } from '../../shared';

export class ReceiveAll {
    static readonly type = '[Requests] Receive all';
    static readonly action = 'allKeys';

    constructor(public requests: RequestItem[]) {
    }
}

export class GetAll implements WsRequestAction {
    static readonly type = '[Requests] Get all';
    readonly action = 'allKeys';
}

export class Remove implements WsRequestAction<string> {
    static readonly type = '[Requests] Remove';
    readonly action = 'remove';

    constructor(public data: string) {
    }
}

export class SkipKey implements WsRequestAction<{ key: string, skip: boolean }> {
    static readonly type = '[Requests] Remove';
    readonly action = 'skipKey';

    constructor(public data: { key: string, skip: boolean }) {
    }
}

