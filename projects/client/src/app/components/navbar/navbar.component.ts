import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Select, Store } from '@ngxs/store';
import { ConfigState, ConfigStateModel, SetState } from '../../store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'prm-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    @Select(ConfigState)
    configs$: Observable<ConfigStateModel>;

    state: boolean;

    constructor(private store: Store) {
        this.configs$
            .pipe(
                map(config => config.state)
            )
            .subscribe(state => this.state = state);
    }

    ngOnInit(): void {
    }

    toggleState(value: MatSlideToggleChange) {
        this.store.dispatch(new SetState(value.checked));
    }
}
