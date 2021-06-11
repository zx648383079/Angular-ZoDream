import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { IItem } from '../../../theme/models/seo';
import { GenerateService } from '../../generate.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

    public schemaItems: IItem[] = [];
    public tableItems: IItem[] = [];
    public schema = '';
    public tables: string[] = [];

    public typeItems: IItem[] = [
        {name: 'SQL文件', value: 'sql'},
        {name: 'ZIP压缩文件', value: 'zip'},
    ];

    constructor(
        private service: GenerateService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.service.schemaList().subscribe(res => {
            this.schemaItems = res.data.map(i => {
                return {
                    name: i,
                    value: i,
                };
            });
        });
    }

    public onSchemaChange() {
        this.service.tableList(this.schema).subscribe(res => {
            this.tableItems = res.data.map(i => {
                return {
                    name: i,
                    value: i,
                };
            });
        });
    }
}
