import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DialogService } from '../../../../../components/dialog';
import { FileUploadService } from '../../../../../theme/services';
import { filterTree } from '../../../../../theme/utils';
import { ICmsCategory, ICmsGroup, ICmsModel } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
    standalone: false,
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(CmsService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public form = this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
        type: 1,
        position: 99,
        model_id: 0,
        parent_id: 0,
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
        setting: this.fb.group({
            open_comment: 0,
        }),
    });

    public data: ICmsCategory;
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
                this.data = res;
                this.categories = filterTree(this.categories, res.id);
                this.form.patchValue({
                    title: res.title, 
                    name: res.name,
                    type: res.type,
                    position: res.position,
                    model_id: res.model_id,
                    parent_id: res.parent_id,
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
                });
                if (res.setting) {
                    this.form.patchValue({
                        setting: this.fb.group(res.setting) as any
                    });
                }
            });
        });
    }

    get typeValue() {
        return this.form.get('type').value;
    }

    public tapBack() {
        history.back();
    }

    public onTitleChange() {
        
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.site = this.site;
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
