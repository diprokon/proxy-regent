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
    receiveAll({ setState }: StateContext<RequestsStateModel>, { requests }: Update) {
        setState(existed => {
                const newState = [...existed];
                requests.forEach(request => {
                    const index = newState.findIndex(item => request.item.key === item.key);
                    switch (request.type) {
                        case ActionType.ADDED:
                            newState.push(request.item);
                            break;
                        case ActionType.MODIFIED:
                            if (index > -1) {
                                newState[index] = request.item;
                            }
                            break;
                        case ActionType.REMOVED:
                            if (index > -1) {
                                newState.splice(index, 1);
                            }
                            break;
                        default:
                            break;
                    }
                });
                return newState;
            }
        );
    }

}
