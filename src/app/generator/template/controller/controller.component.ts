import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent {

    @ViewChild(DialogBoxComponent)
    public modal: DialogBoxComponent;
    public module = '';
    public name = 'Home';

    public previewItems: IPreviewFile[] = [];

    constructor(
        private service: GenerateService,
        private toastrService: DialogService,
    ) { }

    public tapSubmit(preview = true) {
        this.service.controller({
            module: this.module,
            name: this.name,
            preview,
        }).subscribe({
            next: res => {
                this.previewItems = res.data;
                this.modal.open();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
}
