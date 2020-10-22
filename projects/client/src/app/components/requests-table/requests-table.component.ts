import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { RequestItem } from '@prm/shared';
import { Remove, RequestsState, SkipKey } from '../../store/requests';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
    selector: 'prm-requests-table',
    templateUrl: './requests-table.component.html',
    styleUrls: ['./requests-table.component.scss']
})
export class RequestsTableComponent implements AfterViewInit {

    displayedColumns: string[] = ['checkbox', 'key', 'status', 'actions'];
    dataSource = new MatTableDataSource<RequestItem>();
    selection = new SelectionModel<RequestItem>(true, []);

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

    remove(reqs: RequestItem[]) {
        const keys = reqs.map(req => req.key);
        this.store.dispatch(new Remove(keys));
        this.selection.clear();
    }

    toggleSkipState(value: MatSlideToggleChange, reqs: RequestItem[]) {
        const keys = reqs.map(req => req.key);
        this.store.dispatch(new SkipKey({ keys: keys, skip: !value.checked }));
        this.selection.clear();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected == numRows;
      }

    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach(req => this.selection.select(req));
    }
}
