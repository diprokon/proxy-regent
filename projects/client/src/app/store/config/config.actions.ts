import { WsRequestAction } from '../../shared';

export class UpdateState {
    static readonly type = '[Config] Set state';
    static readonly action = 'state';

    constructor(public data: boolean) {
    }
}

export class SetState implements WsRequestAction {
    static readonly type = '[Config] Toggle state';
    readonly action = 'state';

    constructor(public data: boolean) {
    }
}
