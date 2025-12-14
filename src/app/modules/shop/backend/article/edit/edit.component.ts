import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IArticle, IArticleCategory } from '../../../model';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { ArticleService } from '../../article.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditArticleComponent implements OnInit {
    private readonly service = inject(ArticleService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        title: '',
        cat_id: 0,
        thumb: '',
        keywords: '',
        description: '',
        content: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
    });

    public data: IArticle;
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
            this.service.article(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                        id: res.id,
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
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IArticle = this.dataForm().value() as any;
        e?.enter();
        this.service.articleSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
