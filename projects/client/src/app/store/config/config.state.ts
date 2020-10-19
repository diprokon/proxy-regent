import { Action, Actions, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { WsService } from '../../services';
import { SetState } from './config.actions';

export interface ConfigStateModel {
    state: boolean;
}

@State<ConfigStateModel>({
    name: 'config',
    defaults: {
        state: false
    }
})
@Injectable()
export class ConfigState {
    constructor(private wsService: WsService) {
        wsService.registerActions([SetState]);
    }

    @Action(SetState)
    setState({patchState}: StateContext<ConfigStateModel>, {state}: SetState) {
        patchState({
            state
        });
    }
}
