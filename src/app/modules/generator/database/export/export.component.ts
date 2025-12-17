import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { DownloadService } from '../../../../theme/services';
import { GenerateService } from '../../generate.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);
    private readonly downloadService = inject(DownloadService);


    public schemaItems: IItem[] = [];
    public tableItems: IItem[] = [];
    public readonly dataForm = form(signal({
        schema: '',
        tables: [],
        hasStructure: true,
        hasData: true,
        hasDrop: true,
        hasSchema: true,
        expire: 10,
        format: 'sql'
    }));

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
        this.service.tableList(this.dataForm.schema().value()).subscribe(res => {
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
            ...this.dataForm().value()
        });
    }
}
