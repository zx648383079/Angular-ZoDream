import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { GenerateService } from '../../generate.service';
import { form } from '@angular/forms/signals';
import { ArraySource } from '../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);

    public readonly schemaItems = signal(ArraySource.empty);
    public readonly dataForm = form(signal({
        schema: '',
    }));

    constructor() {
        this.service.schemaList().subscribe(res => {
            this.schemaItems.set(ArraySource.fromValue(...res.data));
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
