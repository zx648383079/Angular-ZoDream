import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import {
    IBrand
} from '../../../../model';
import { FileUploadService } from '../../../../../../theme/services/file-upload.service';
import { GoodsService } from '../../goods.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-brand',
    templateUrl: './edit-brand.component.html',
    styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {
    private readonly service = inject(GoodsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        keywords: '',
        description: '',
        logo: '',
        app_logo: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IBrand;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.brand(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                        id: res.id,
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
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IBrand = this.dataForm().value() as any;
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any, name: string = 'logo') {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.dataForm[name]().value.set(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.dataForm[name]().value(), '_blank');
    }

}
