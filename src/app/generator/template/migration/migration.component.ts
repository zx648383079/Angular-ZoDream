import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { IItem } from '../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { IPreviewFile } from '../../model';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {

    @ViewChild(DialogBoxComponent)
    public modal: DialogBoxComponent;
    public module = '';
    public tableItems: IItem[] = [];
    public selected: string[] = [];
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
        this.service.migration({
            module: this.module,
            table: this.selected,
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
