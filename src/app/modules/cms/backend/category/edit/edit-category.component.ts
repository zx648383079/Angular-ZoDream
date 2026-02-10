import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { filterTree } from '../../../../../theme/utils';
import { ICmsCategory, ICmsGroup, ICmsModel } from '../../../model';
import { CmsService } from '../../cms.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        title: '',
        type: 1,
        position: 99,
        model_id: '',
        parent_id: '',
        keywords: '',
        description: '',
        thumb: '',
        image: '',
        content: '',
        url: '',
        groups: '',
        category_template: '',
        list_template: '',
        show_template: '',
        setting: {
            open_comment: 0,
        },
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.title);
    });

    public categories: ICmsCategory[] = [];
    public typeItems = ['内容', '单页', '外链'];
    public modelItems: ICmsModel[] = [];
    public groupItems: ICmsGroup[] = [];
    private site = 0;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.site = parseInt(params.site, 10);
            this.service.batch({
                category: {site: this.site},
                group: {},
                model: {type: 0}
            }).subscribe(res => {
                this.categories = res.category;
                this.groupItems = res.group;
                this.modelItems = res.model;
            });
            if (!params.id) {
                return;
            }
            this.service.category(this.site, params.id).subscribe(res => {
                this.categories = filterTree(this.categories, res.id);
                this.dataModel.set({
                    id: res.id,
                    title: res.title,
                    name: res.name,
                    type: res.type,
                    position: res.position,
                    model_id: res.model_id as any,
                    parent_id: res.parent_id as any,
                    keywords: res.keywords,
                    description: res.description,
                    thumb: res.thumb,
                    image: res.image,
                    content: res.content,
                    url: res.url,
                    groups: res.groups,
                    category_template: res.category_template,
                    list_template: res.list_template,
                    show_template: res.show_template,
                    setting: {
                        open_comment: res.setting?.open_comment,
                    }
                });
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public onTitleChange() {

    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
        data.site = this.site;
        e?.enter();
        this.service.categorySave(data).subscribe({
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
