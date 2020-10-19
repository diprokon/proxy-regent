import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter, map } from 'rxjs/operators';
import { Actions, Store } from '@ngxs/store';
import { ActionContext, ActionStatus } from '@ngxs/store/src/actions-stream';
import { WsMessageModel } from '@prm/shared';
import { isWsRequestAction, WsRequestAction, WsResponseAction } from '../shared';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WsService {
    private webSocket: WebSocketSubject<WsMessageModel> = webSocket(environment.wsUrl);

    private readonly actions = new Map<string, WsResponseAction[]>();

    constructor(private store: Store, private actions$: Actions) {
        this.webSocket.subscribe(msg => {
            (this.actions.get(msg.action) || [])
                .forEach(action => this.store.dispatch(new action(msg.data)))
        });
        this.actions$
            .pipe(
                filter((action: ActionContext) => action.status === ActionStatus.Successful && isWsRequestAction(action.action)),
                map(action => action.action)
            )
            .subscribe(action => {
                this.send(action);
            });
    }

    send(action: WsRequestAction) {
        this.webSocket.next(action);
    }

    registerActions(actions: WsResponseAction[]) {
        actions
            .forEach(action => {
                const actionKey = action.action;
                if (!this.actions.has(actionKey)) {
                    this.actions.set(actionKey, []);
                }
                this.actions.get(actionKey).push(action);
            })
    }
}
