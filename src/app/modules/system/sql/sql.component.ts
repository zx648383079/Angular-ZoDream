import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { SystemService } from '../system.service';

@Component({
    standalone: false,
    selector: 'app-seo-sql',
    templateUrl: './sql.component.html',
    styleUrls: ['./sql.component.scss']
})
export class SqlComponent implements OnInit {
    private readonly service = inject(SystemService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<any[]>([]);
    public readonly isLoading = signal(false);

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {
    }

    public tapRefresh() {
        this.service.sqlList().subscribe(res => {
            this.items.set(res.data);
        });
    }

    public tapBackup() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.sqlBackup().subscribe({
            next: _ => {
                this.isLoading.set(false);
                this.toastrService.success('备份成功');
                this.tapRefresh();
            },
            error: err => {
                this.toastrService.error(err);
                this.isLoading.set(false);
            }
        });
    }

    public tapClear() {
        this.toastrService.confirm('确认清除所有备份?', () => {
            this.service.sqlClear().subscribe(res => {
                this.toastrService.success('成功清除所有备份');
                this.items.set([]);
            });
        });
    }
}
