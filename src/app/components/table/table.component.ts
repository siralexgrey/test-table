import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeWhile } from 'rxjs';
import { HttpService } from './../../services/http.service';
import { AddUserDialogComponent } from './../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  alive = true;
  users: IRow[] = [];
  dataSource!: MatTableDataSource<IRow>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone'];
  expandedUser!: IRow | null;
  isLoading = true;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.getRows();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRows() {
    this.httpService.getUsers().pipe(takeWhile(() => this.alive)).subscribe((data: IRow[]) => {
      this.users = data;
      this.dataSource.data = this.users;
      this.isLoading = false;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddModal() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px'
    })
    .afterClosed().subscribe(result => {
      if (result) {
        this.users.unshift(result);
        this.dataSource.data = this.users;
      }
    });
  }
}

export interface IRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: IAddress;
  description: string;
}

export interface IAddress {
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}
