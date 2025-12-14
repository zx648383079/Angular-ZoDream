import { Component, OnInit, inject, viewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';

@Component({
    standalone: false,
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);


    public readonly modal = viewChild(DialogBoxComponent);
    public module = '';
    public tableItems: IItem[] = [];
    public selected = '';
    public name = '';
    public hasController = true;
    public hasView = true;
    public hasModel = true;
    public previewItems: IPreviewFile[] = [];

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
                this.modal().open();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
}
