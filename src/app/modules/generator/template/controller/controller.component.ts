import { Component, OnInit, inject, viewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';

@Component({
    standalone: false,
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent {
    private service = inject(GenerateService);
    private toastrService = inject(DialogService);


    public readonly modal = viewChild(DialogBoxComponent);
    public module = '';
    public name = 'Home';

    public previewItems: IPreviewFile[] = [];

    public tapSubmit(preview = true) {
        this.service.controller({
            module: this.module,
            name: this.name,
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
