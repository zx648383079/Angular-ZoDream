import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { DownloadService } from '../../../../theme/services';
import { GenerateService } from '../../generate.service';

@Component({
    standalone: false,
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
    private service = inject(GenerateService);
    private toastrService = inject(DialogService);
    private downloadService = inject(DownloadService);


    public schemaItems: IItem[] = [];
    public tableItems: IItem[] = [];
    public schema = '';
    public tables: string[] = [];
    public hasStructure = true;
    public hasData = true;
    public hasDrop = true;
    public hasSchema = true;
    public expire = 10;
    public format = 'sql';

    public typeItems: IItem[] = [
        {name: 'SQL文件', value: 'sql'},
        {name: 'ZIP压缩文件', value: 'zip'},
    ];

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

    public tapSubmit() {
        this.downloadService.export('gzo/database/export', {
            schema: this.schema,
            table: this.tables,
            hasStructure: this.hasStructure,
            hasData: this.hasData,
            hasDrop: this.hasDrop,
            hasSchema: this.hasSchema,
            expire: this.expire,
            format: this.format,
        });
    }
}
