import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { RequestItem, RequestMethod } from '@prm/shared';
import { SelectionModel } from '@angular/cdk/collections';
import { Remove, RequestsState, SkipKey } from '../../store';


@Component({
    selector: 'prm-requests-table',
    templateUrl: './requests-table.component.html',
    styleUrls: ['./requests-table.component.scss']
})
export class RequestsTableComponent implements AfterViewInit {

    displayedColumns: string[] = ['checkbox', 'key', 'method', 'status', 'actions'];
    dataSource = new MatTableDataSource<RequestItem>();
    selection = new SelectionModel<string>(true, []);

    @Select(RequestsState)
    requests$: Observable<RequestItem[]>;

    constructor(private store: Store) {
        this.requests$.subscribe(data => {
            this.dataSource.data = data;
        })
    }

    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    isSuccessStatus(status: number): boolean {
        return status < 400;
    }

    getMethodClass(method: RequestMethod): string {
        switch(method) {
            case RequestMethod.DELETE:
                return 'text-warn';
            case RequestMethod.GET:
                return 'text-primary';
            default:
                return 'text-accent';
        }
    }

    remove($event: MouseEvent, keys: string[]) {
        keys.forEach(key => this.selection.deselect(key));
        this.store.dispatch(new Remove(keys));
    }

    toggleSkipState(value: MatSlideToggleChange, keys: string[]) {
        this.store.dispatch(new SkipKey({ keys, skip: !value.checked }));
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
      }

    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach(req => this.selection.select(req.key));
    }
}
