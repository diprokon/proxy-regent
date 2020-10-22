import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { RequestItem } from '@prm/shared';
import { WsService } from '../../services';
import { GetAll, ReceiveAll } from './requests.actions';

export type RequestsStateModel = RequestItem[];

@State<RequestsStateModel>({
    name: 'requests',
    defaults: []
})
@Injectable()
export class RequestsState implements NgxsOnInit {
    constructor(private wsService: WsService, private store: Store) {
        this.wsService.registerActions([ReceiveAll]);
    }

    ngxsOnInit() {
        this.store.dispatch(new GetAll())
    }

    @Action(ReceiveAll)
    receiveAll({setState}: StateContext<RequestsStateModel>, {requests}: ReceiveAll) {
        setState(requests);
    }

}
