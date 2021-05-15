import {
    Component,
    OnInit
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../dialog';
import {
    IBrand
} from '../../../../../theme/models/shop';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { GoodsService } from '../../goods.service';

@Component({
    selector: 'app-edit-brand',
    templateUrl: './edit-brand.component.html',
    styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        keywords: [''],
        description: [''],
        logo: [''],
        app_logo: [''],
    });

    public data: IBrand;

    constructor(
        private service: GoodsService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.brand(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    keywords: res.keywords,
                    description: res.description,
                    logo: res.logo,
                    app_logo: res.app_logo,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IBrand = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    public uploadFile(event: any, name: string = 'logo') {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.form.get(name).setValue(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.form.get(name).value, '_blank');
    }

}
