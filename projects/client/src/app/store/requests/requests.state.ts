import { Action, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ActionType, RequestItem } from '@prm/shared';
import { WsService } from '../../services';
import { Update } from './requests.actions';

export type RequestsStateModel = RequestItem[];

@State<RequestsStateModel>({
    name: 'requests',
    defaults: []
})
@Injectable()
export class RequestsState {
    constructor(private wsService: WsService, private store: Store) {
        this.wsService.registerActions([Update]);
    }

    @Action(Update)
    receiveAll({setState}: StateContext<RequestsStateModel>, {requests}: Update) {
        setState(existed => {
            let newState = [ ...existed];
            requests.forEach(request => {
                if (request.type === ActionType.ADDED) {
                    newState.push(request.item);
                } else {
                    const index = newState.findIndex(item => request.item.key === item.key);
                    if (index > -1) {
                        if (request.type === ActionType.REMOVED) {
                            newState.splice(index, 1);
                        } else {
                            newState[index] = request.item; // ActionType.MODIFIED
                        }
                    }
                }
            });
            return newState;
        });
    }

}
