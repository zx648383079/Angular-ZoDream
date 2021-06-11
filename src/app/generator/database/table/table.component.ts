import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITableHeaderItem } from '../../../theme/components/editable-table/model';
import { GenerateService } from '../../generate.service';
import { ITable } from '../../model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    public items: ITable[] = [];
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
    public isLoading = false;

    constructor(
        private service: GenerateService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.route.queryParams.subscribe(params => {
            this.schema = params.schema;
            this.service.tableList(this.schema, true).subscribe(res => {
                this.isLoading = false;
                this.items = res.data;
            });
        });
    }

}
