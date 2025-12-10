import { Component, OnInit, inject } from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
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

@Component({
    standalone: false,
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
    private service = inject(ArticleService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private uploadService = inject(FileUploadService);


    public form = this.fb.group({
        name: ['', Validators.required],
        parent_id: [0],
        thumb: [''],
        keywords: [''],
        description: ['']
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
                this.form.patchValue({
                    name: res.name,
                    parent_id: res.parent_id,
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
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IArticleCategory = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.form.get('thumb').setValue(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.form.get(name).value, '_blank');
    }

}