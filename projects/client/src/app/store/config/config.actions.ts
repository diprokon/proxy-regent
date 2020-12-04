import { WsActions, WsRequests, WsStateRequest } from '@prm/shared';

export class UpdateState {
    static readonly type = '[Config] Set state';
    static readonly action = WsActions.STATE;

    constructor(public data: boolean) {
    }
}

export class SetState implements WsStateRequest {
    static readonly type = '[Config] Toggle state';
    readonly action = WsRequests.STATE;

    constructor(public data: boolean) {
    }
}
