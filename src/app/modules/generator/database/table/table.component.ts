import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenerateService } from '../../generate.service';
import { ITable } from '../../model';
import { ITableHeaderItem } from '../../../../components/desktop/editable-table/model';

@Component({
    standalone: false,
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly route = inject(ActivatedRoute);


    public readonly items = signal<ITable[]>([]);
    public headerItems: ITableHeaderItem[] = [
        {name: 'Name', label: '表', searchable: true},
        {name: 'Rows', label: '行数', format: 'numberFormat'},
        {name: 'Engine', label: '类型', hidden: true},
        {name: 'Collation', label: '排序规则', hidden: true},
        {name: 'Index_length', label: '大小', format: 'size'},
        {name: 'Comment', label: '注释'},
        {name: 'Data_free', label: '碎片', format: 'size', hidden: true},
    ];
    public schema = '';
    public readonly isLoading = signal(false);

    ngOnInit() {
        this.isLoading.set(true);
        this.route.queryParams.subscribe(params => {
            this.schema = params.schema;
            this.service.tableList(this.schema, true).subscribe(res => {
                this.isLoading.set(false);
                this.items.set(res.data);
            });
        });
    }

}
