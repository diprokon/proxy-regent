import { Action, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { RequestItem } from '@prm/shared';
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
        // TODO
    }

}
