import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../dialog';
import { FileUploadService } from '../../../theme/services/file-upload.service';
import { LegworkService } from '../../legwork.service';
import { ICategory, IProvider } from '../../model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public data: IProvider;
    public form = this.fb.group({
        name: ['', Validators.required],
        logo: ['', Validators.required],
        tel: ['', Validators.required],
        address: ['', Validators.required],
        categories: [],
    });
    public categories: ICategory[] = [];

    constructor(
        private service: LegworkService,
        private fb: FormBuilder,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
        this.service.providerProfile().subscribe(res => {
            this.data = res;
            if (!res.name) {
                return;
            }
            this.form.patchValue({
                name: res.name,
                logo: res.logo,
                tel: res.tel,
                address: res.address,
                categories: res.categories.map(i => i.id),
            });
        });
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
    }

    public tapSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.data.status === 1 && !confirm('继续保存将需要重新审核？')) {
            return;
        }
        const data = Object.assign({}, this.form.value);
        this.service.providerSave(data).subscribe(res => {
            this.data = res;
            this.toastrService.success('提交成功，等待审核!');
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.form.get('logo').setValue(res.url);
        });
    }
    public tapPreview() {
        window.open(this.form.get('logo').value, '_blank');
    }
}
