export interface WsActionModel<T = any> {
    action: string;
    data?: T;
}

export function isWsActionModel(action: any | WsActionModel): action is WsActionModel {
    return typeof action.action === 'string';
}
