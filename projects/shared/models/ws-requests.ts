export enum WsRequests {
    SKIP = 'skipKey',
    STATE = 'state',
    REMOVE = 'remove',
}

export interface WsRequestBase<T = any> {
    action: WsRequests;
    data?: T;
}

export interface WsSkipRequestModel {
    keys: string[];
    skip: boolean;
}

export interface WsSkipRequest extends WsRequestBase<WsSkipRequestModel> {
    action: WsRequests.SKIP
}

export interface WsStateRequest extends WsRequestBase<boolean> {
    action: WsRequests.STATE
}

export interface WsRemoveRequest extends WsRequestBase<string[]> {
    action: WsRequests.REMOVE
}

export function isWsRequest(action: any | WsRequest): action is WsRequest {
    return typeof action.action === 'string';
}

export type WsRequest =
    | WsSkipRequest
    | WsStateRequest
    | WsRemoveRequest;
