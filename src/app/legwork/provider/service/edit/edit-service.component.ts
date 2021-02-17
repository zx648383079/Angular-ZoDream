import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { LegworkService } from '../../../legwork.service';
import { ICategory, IService } from '../../../model';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit {

    public data: IService;
    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: ['', Validators.required],
        cat_id: [0, Validators.required],
        price: [0, Validators.required],
        brief: [''],
        content: [''],
        form: this.fb.array([])
    });
    public categories: ICategory[] = [];

    constructor(
        private service: LegworkService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastrService: ToastrService,
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
        this.service.providerCategory().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.addForm();
                return;
            }
            this.loadService(params.id);
        });
    }

    get formItems() {
        return this.form.get('form') as FormArray;
    }

    public addForm() {
        this.formItems.push(this.fb.group({
            name: ['', Validators.required],
            label: ['', Validators.required],
            required: [false],
            only: [false],
        }));
    }

    public removeForm(i: number) {
        this.formItems.removeAt(i);
    }

    private loadService(id: any) {
        this.service.providerService(id).subscribe(res => {
            this.data = res;
            this.form.patchValue({
                name: res.name,
                thumb: res.thumb,
                cat_id: res.cat_id,
                price: res.price,
                brief: res.brief,
                content: res.content,
            });
            if (res.form) {
                for (const item of res.form) {
                    this.formItems.push(this.fb.group(item));
                }
            }
        });
    }

    public tapSubmit() {
        if (this.form.invalid) {
            return;
        }
        const data: IService = Object.assign({}, this.form.value);
        if (this.data) {
            data.id = this.data.id;
        }
        data.form = data.form.filter(i => !!i.name).map(i => {
            if (!i.label) {
                i.label = i.name;
            }
            return i;
        });
        this.service.providerServiceSave(data).subscribe(res => {
            this.toastrService.success('保存成功');
            history.back();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.form.get('thumb').setValue(res.url);
        });
    }
    public tapPreview() {
        window.open(this.form.get('thumb').value, '_blank');
    }

}
