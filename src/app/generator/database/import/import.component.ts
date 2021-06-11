import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { IItem } from '../../../theme/models/seo';
import { GenerateService } from '../../generate.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
    public schemaItems: IItem[] = [];
    public schema = '';

    constructor(
        private service: GenerateService,
        private toastrService: DialogService,
    ) { }

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

    public onFileChange(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('file', files[0]);
        form.append('schema', this.schema);
        this.service.import(form).subscribe(_ => {
            this.toastrService.success('导入成功');
        });
    } 

}
