import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { GenerateService } from '../../generate.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-query',
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public items: any[] = [];
    public isLoading = false;
    public total = -1;
    public readonly queries = form(signal({
        sql: '',
        page: 1,
        per_page: 20,
        schema: '',
        table: '',
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => {
                v.schema = params.schema;
                v.table = params.table;
                if (v.table) {
                    v.sql = `SELECT * FROM \`${v.table}\``;
                }
                return v;
            });
            if (params.table) {
                this.onPageChange(1);
            }
        });
    }

    public tapReset() {
        this.items = [];
        this.total = -1;
        this.queries().value.update(v => {
            v.page = 1;
            v.sql = '';
            return v;
        });
    }

    public tapRun() {
        this.onPageChange(1);
    }

    public onPageChange(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.query(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.total = res.paging.total;
                this.isLoading = false;
                this.queries().value.set(queries);
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
            }
        })
    }
}
