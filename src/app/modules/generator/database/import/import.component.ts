import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { GenerateService } from '../../generate.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);

    public schemaItems: IItem[] = [];
    public readonly dataForm = form(signal({
        schema: '',
    }));

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
        form.append('schema', this.dataForm.schema().value());
        this.service.import(form).subscribe(_ => {
            this.toastrService.success('导入成功');
        });
    } 

}
