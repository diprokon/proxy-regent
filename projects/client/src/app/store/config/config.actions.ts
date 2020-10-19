import { WsRequestAction } from '../../shared';

export class SetState {
    static readonly type = '[Config] Set state';
    static readonly action = 'state';

    constructor(public state: boolean) {
    }
}

export class ToggleState implements WsRequestAction {
    static readonly type = '[Config] Toggle state';
    readonly action = 'toggleState';

    constructor(public data: boolean) {
    }
}
