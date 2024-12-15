import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITableHeaderItem } from '../../../../theme/components/editable-table/model';
import { GenerateService } from '../../generate.service';
import { IColumn } from '../../model';

@Component({
    standalone: false,
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {

    public items: IColumn[] = [];
    public headerItems: ITableHeaderItem[] = [
        {name: 'Field', label: '列名'},
        {name: 'Type', label: '类型'},
        {name: 'Collation', label: '排序规则', hidden: true},
        {name: 'Null', label: '空', format: value => value === 'NO' ? '否' : '是'},
        {name: 'Default', label: '默认'},
        {name: 'Comment', label: '注释'},
        {name: 'Extra', label: '额外', hidden: true},
    ];
    public schema = '';
    public table = '';
    public isLoading = false;

    constructor(
        private service: GenerateService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.route.queryParams.subscribe(params => {
            this.schema = params.schema;
            this.table = params.table;
            this.service.columnList(this.table, this.schema, true).subscribe(res => {
                this.isLoading = false;
                this.items = res.data;
            });
        });
    }

}
