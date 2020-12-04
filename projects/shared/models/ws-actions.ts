import { RequestItem } from './request-item.model';
import { ActionType } from './action-type';

export enum WsActions {
    UPDATE = 'update',
    STATE = 'state',
}

export interface WsActionBase<T = any> {
    action: WsActions;
    data?: T;
}

export interface UpdatedItem {
    type: ActionType;
    item: RequestItem
}

export interface WsUpdateAction extends WsActionBase<UpdatedItem[]> {
    action: WsActions.UPDATE
}

export interface WsUpdateState extends WsActionBase<boolean> {
    action: WsActions.STATE
}

export function isWsAction(action: any | WsAction): action is WsAction {
    return typeof action.action === 'string';
}

export type WsAction =
    | WsUpdateAction
    | WsUpdateState
