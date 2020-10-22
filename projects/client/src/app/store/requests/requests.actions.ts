import { RequestItem, WsActionModel } from '@prm/shared';

export class ReceiveAll {
    static readonly type = '[Requests] Receive all';
    static readonly action = 'allKeys';

    constructor(public requests: RequestItem[]) {
    }
}

export class GetAll implements WsActionModel {
    static readonly type = '[Requests] Get all';
    readonly action = 'allKeys';
}

export class Remove implements WsActionModel<string[]> {
    static readonly type = '[Requests] Remove';
    readonly action = 'remove';

    constructor(public data: string[]) {
    }
}

export class SkipKey implements WsActionModel<{ keys: string[], skip: boolean }> {
    static readonly type = '[Requests] Skip Key';
    readonly action = 'skipKey';

    constructor(public data: { keys: string[], skip: boolean }) {
    }
}

