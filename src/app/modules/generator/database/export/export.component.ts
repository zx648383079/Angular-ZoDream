import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { form } from '@angular/forms/signals';
import { ArraySource, ButtonEvent } from '../../../../components/form';
import { FileUploadService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss']
})
export class ExportComponent {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly schemaItems = signal(ArraySource.empty);
    public readonly tableItems = signal(ArraySource.empty);
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

    constructor() {
        this.service.schemaList().subscribe(res => {
            this.schemaItems.set(ArraySource.fromValue(...res.data));
        });
    }

    public onSchemaChange() {
        this.service.tableList(this.dataForm.schema().value()).subscribe(res => {
            this.tableItems.set(ArraySource.fromValue(...res.data));
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
