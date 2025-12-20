import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-model',
    templateUrl: './model.component.html',
    styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);


    public readonly modal = viewChild(DialogBoxComponent);

    public tableItems: IItem[] = [];

    public previewItems: IPreviewFile[] = [];
    public readonly dataForm = form(signal({
        module: '',
        table: '',
    }));

    ngOnInit() {
        this.service.tableList().subscribe(res => {
            this.tableItems = res.data.map(i => {
                return {
                    name: i,
                    value: i,
                };
            });
        });
    }

    public tapSubmit(preview = true) {
        this.service.model({
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
