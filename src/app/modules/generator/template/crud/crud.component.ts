import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

    @ViewChild(DialogBoxComponent)
    public modal: DialogBoxComponent;
    public module = '';
    public tableItems: IItem[] = [];
    public selected = '';
    public name = '';
    public hasController = true;
    public hasView = true;
    public hasModel = true;
    public previewItems: IPreviewFile[] = [];

    constructor(
        private service: GenerateService,
        private toastrService: DialogService,
    ) { }

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
        this.service.crud({
            module: this.module,
            table: this.selected,
            name: this.name,
            hasController: this.hasController,
            hasModel: this.hasModel,
            hasView: this.hasView,
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
