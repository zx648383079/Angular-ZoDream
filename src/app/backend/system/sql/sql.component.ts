import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-sql',
  templateUrl: './sql.component.html',
  styleUrls: ['./sql.component.scss']
})
export class SqlComponent implements OnInit {

  public items: any[] = [];

  public isLoading = false;

  constructor(
    private service: SystemService,
    private toastrService: ToastrService,
  ) {
    this.tapRefresh();
  }

  ngOnInit() {
  }

  public tapRefresh() {
    this.service.sqlList().subscribe(res => {
      this.items = res.data;
    });
  }

  public tapBackup() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.service.sqlBackup().subscribe(res => {
      this.isLoading = false;
      this.toastrService.success('备份成功');
      this.tapRefresh();
    });
  }

  public tapClear() {
    if (!confirm('确认清除所有备份?')) {
      return;
    }
    this.service.sqlClear().subscribe(res => {
      this.toastrService.success('成功清除所有备份');
      this.items = [];
    });
  }
}
