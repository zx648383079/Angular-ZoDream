import { Component, OnInit, inject, signal } from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import {
    IArticleCategory
} from '../../../model';
import {
    FileUploadService
} from '../../../../../theme/services/file-upload.service';
import {
    filterTree
} from '../../../../../theme/utils';
import {
    ArticleService
} from '../../article.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
    private readonly service = inject(ArticleService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        parent_id: '',
        thumb: '',
        keywords: '',
        description: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IArticleCategory;
    public categories: IArticleCategory[] = [];

    constructor() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.category(params.id).subscribe(res => {
                this.data = res;
                this.categories = filterTree(this.categories, res.id);
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    parent_id: res.parent_id as any,
                    thumb: '',
                    keywords: res.keywords,
                    description: res.description
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
        const data: IArticleCategory = this.dataForm().value() as any;
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.dataForm.thumb().value.set(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.dataForm[name]().value(), '_blank');
    }

}
