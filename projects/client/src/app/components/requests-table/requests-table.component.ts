import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { RequestItem } from '@prm/shared';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Remove, RequestsState } from '../../store/requests';


@Component({
  selector: 'prm-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss']
})
export class RequestsTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['key', 'status', 'actions'];
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
}
