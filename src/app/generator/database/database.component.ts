import { Component, OnInit } from '@angular/core';
import { ITableHeaderItem } from '../../theme/components/editable-table/model';
import { IItem } from '../../theme/models/seo';
import { GenerateService } from '../generate.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

    public items: any[] = [];
    public headerItems: ITableHeaderItem[] = [
        {name: 'name', label: '数据库'},
        {name: 'collation', label: '排序规则'},
    ];

    public collationItems: IItem[] = [
        {name: 'UTF8编码', value: 'utf8_general_ci'},
        {name: 'UTF8M64编码', value: 'utf8mb4_general_ci'},
    ];
    public isLoading = false;

    constructor(
        private service: GenerateService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.service.schemaList(true).subscribe(res => {
            this.isLoading = false;
            this.items = res.data.map(i => {
                return {
                    name: i
                };
            });
        });
    }

}
