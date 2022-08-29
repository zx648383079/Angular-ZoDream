import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IArticle, IArticleCategory } from '../../../model';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { ArticleService } from '../../article.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditArticleComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        cat_id: [0],
        thumb: [''],
        keywords: [''],
        description: [''],
        content: ['']
    });

    public data: IArticle;
    public categories: IArticleCategory[] = [];

    constructor(
        private service: ArticleService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
        if (!params.id) {
            return;
        }
        this.service.article(params.id).subscribe(res => {
            this.data = res;
            this.form.patchValue({
                title: res.title,
                cat_id: res.cat_id,
                thumb: res.thumb,
                keywords: '',
                description: res.description,
                content: res.content
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IArticle = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.articleSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('保存成功');
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
