import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Select, Store } from '@ngxs/store';
import { ConfigState, ConfigStateModel } from '../../store/config';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ToggleState } from '../../store/config';

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
                tap(console.log),
                map(config => config.state)
            )
            .subscribe(state => this.state = state);
    }

    ngOnInit(): void {
    }

    toddleState(value: MatSlideToggleChange) {
        this.store.dispatch(new ToggleState(value.checked));
    }
}
