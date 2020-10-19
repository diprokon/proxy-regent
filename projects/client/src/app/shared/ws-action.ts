export interface WsResponseAction {
    readonly action: string;
    new(...args: any[]): any;
}

export interface WsRequestAction<T = any> {
    readonly action: string;
    data?: T;
}

export function isWsRequestAction(action: any | WsRequestAction): action is WsRequestAction {
    return typeof action.action === 'string';
}
