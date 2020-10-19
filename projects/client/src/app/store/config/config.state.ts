import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { WsService } from '../../services';
import { UpdateState } from './config.actions';

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
        wsService.registerActions([UpdateState]);
    }

    @Action(UpdateState)
    setState({patchState}: StateContext<ConfigStateModel>, {data}: UpdateState) {
        patchState({
            state: data
        });
    }
}
