import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { GenerateService } from '../../generate.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

    public items: any[] = [];
    public schema = '';
    public table = '';
    public isLoading = false;
    public page = 1;
    public perPage = 20;
    public total = -1;
    public sql = '';

    constructor(
        private service: GenerateService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.schema = params.schema;
            this.table = params.table;
            if (this.table) {
                this.sql = `SELECT * FROM \`${this.table}\``;
                this.onPageChange(1);
            }
        });
    }

    public tapReset() {
        this.items = [];
        this.sql = '';
        this.total = -1;
        this.page = 1;
    }

    public tapRun() {
        this.onPageChange(1);
    }

    public onPageChange(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.query({
            sql: this.sql,
            page: this.page,
            per_page: this.perPage,
            schema: this.schema,
            table: this.table,
        }).subscribe({
            next: res => {
                this.items = res.data;
                this.page = page;
                this.total = res.paging.total;
            },
            error: err => {
                this.toastrService.error(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        })
    }
}
