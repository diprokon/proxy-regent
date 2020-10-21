import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { RequestItem } from '@prm/shared';
import { CheckedKey, Remove, RequestsState, SkipKey } from '../../store/requests';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
    selector: 'prm-requests-table',
    templateUrl: './requests-table.component.html',
    styleUrls: ['./requests-table.component.scss']
})
export class RequestsTableComponent implements AfterViewInit {

    displayedColumns: string[] = ['checkbox', 'key', 'status', 'actions'];
    dataSource = new MatTableDataSource<RequestItem>();

    @Select(RequestsState)
    requests$: Observable<RequestItem[]>;

    constructor(private store: Store) {
        this.requests$.subscribe(data => this.dataSource.data = data);
    }

    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    isSuccessStatus(status: number): boolean {
        return status < 400;
    }

    remove(req: RequestItem) {
        this.store.dispatch(new Remove(req.key));
    }

    toggleSkipState(value: MatSlideToggleChange, req: RequestItem) {
        this.store.dispatch(new SkipKey({ key: req.key, skip: !value.checked }));
    }

    toggleCheckedState(value: MatCheckboxChange, req: RequestItem) {
        this.store.dispatch(new CheckedKey({ key: req?.key, checked: !value.checked }));
    }

    isAllSelected() {
        return this.dataSource.data.every(req => req.checked);
    }

    isSomeSelected() {
        return this.dataSource.data.some(req => req.checked);
    }
}
