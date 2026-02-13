import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { form } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../components/form';
import { FileUploadService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


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

    public tapSubmit(e?: ButtonEvent) {
        e?.enter();
        this.uploadService.export('gzo/database/export', {
            ...this.dataForm().value()
        }).subscribe({
            next: _ => {
                e?.reset();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
