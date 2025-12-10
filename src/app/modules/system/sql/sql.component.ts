import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { SystemService } from '../system.service';

@Component({
    standalone: false,
  selector: 'app-sql',
  templateUrl: './sql.component.html',
  styleUrls: ['./sql.component.scss']
})
export class SqlComponent implements OnInit {
    private service = inject(SystemService);
    private toastrService = inject(DialogService);


    public items: any[] = [];
    public isLoading = false;

    constructor() {
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
        this.service.sqlBackup().subscribe({
            next: _ => {
                this.isLoading = false;
                this.toastrService.success('备份成功');
                this.tapRefresh();
            },
            error: err => {
                this.toastrService.error(err);
                this.isLoading = false;
            }
        });
    }

    public tapClear() {
        this.toastrService.confirm('确认清除所有备份?', () => {
            this.service.sqlClear().subscribe(res => {
                this.toastrService.success('成功清除所有备份');
                this.items = [];
            });
        });
    }
}
