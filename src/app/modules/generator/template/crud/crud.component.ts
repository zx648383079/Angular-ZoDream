import { Component, inject, signal, viewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';
import { form } from '@angular/forms/signals';
import { ArraySource } from '../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-crud',
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.scss']
})
export class CrudComponent {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);


    public readonly modal = viewChild(DialogBoxComponent);
    public readonly tableItems = signal(ArraySource.empty);
    public previewItems: IPreviewFile[] = [];
    public readonly dataForm = form(signal({
        module: '',
        table: '',
        name: '',
        hasController: true,
        hasModel: true,
        hasView: true,
    }));

    constructor() {
        this.service.tableList().subscribe(res => {
            this.tableItems.set(ArraySource.fromValue(...res.data));
        });
    }

    public tapSubmit(preview = true) {
        this.service.crud({
            ...this.dataForm().value(),
            preview,
        }).subscribe({
            next: res => {
                this.previewItems = res.data;
                this.modal().open();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
}
