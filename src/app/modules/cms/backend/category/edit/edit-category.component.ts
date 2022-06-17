import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DialogService } from '../../../../../components/dialog';
import { FileUploadService } from '../../../../../theme/services';
import { filterTree } from '../../../../../theme/utils';
import { ICmsCategory, ICmsGroup, ICmsModel } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

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

    public editorConfigs = {
        key: environment.editorKey,
        init: {
            height: 500,
            base_url: '/tinymce',
            suffix: '.min',
            language_url: '../../../assets/tinymce/langs/zh_CN.js',
            language: 'zh_CN',
            plugins: [
            'advlist autolink lists link image imagetools charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
            image_caption: true,
            paste_data_images: true,
            imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
            images_upload_handler: (blobInfo, success: (url: string) => void, failure: (error: string) => void) => {
                const form = new FormData();
                form.append('file', blobInfo.blob(), blobInfo.filename());
                this.uploadService.uploadImages(form).subscribe({
                    next: res => {
                        success(res[0].url);
                    }, 
                    error: err => {
                        failure(err.error.message);
                    }
                });
            },
        }
    }

    constructor(
        private fb: FormBuilder,
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {}

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
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.site = this.site;
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
