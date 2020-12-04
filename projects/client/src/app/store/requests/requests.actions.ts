import { UpdatedItem, WsActions, WsRemoveRequest, WsRequests, WsSkipRequest, WsSkipRequestModel } from '@prm/shared';

export class Update {
    static readonly type = '[Requests] Update';
    static readonly action = WsActions.UPDATE;

    constructor(public requests: UpdatedItem[]) {
    }
}

export class Remove implements WsRemoveRequest {
    static readonly type = '[Requests] Remove';
    readonly action = WsRequests.REMOVE;

    constructor(public data: string[]) {
    }
}

export class SkipKey implements WsSkipRequest {
    static readonly type = '[Requests] Skip Key';
    readonly action = WsRequests.SKIP;

    constructor(public data: WsSkipRequestModel) {
    }
}

