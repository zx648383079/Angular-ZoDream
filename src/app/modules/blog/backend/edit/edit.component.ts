import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IImageUploadEvent } from '../../../../components/editor';
import { ButtonEvent } from '../../../../components/form';
import {
    IBlog,
    ICategory,
    ITag
} from '../../model';
import { IItem } from '../../../../theme/models/seo';
import {
    FileUploadService
} from '../../../../theme/services/file-upload.service';
import {
    BlogService
} from '../blog.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        keywords: [''],
        content: ['', Validators.required],
        description: [''],
        term_id: [0, Validators.required],
        programming_language: [''],
        type: ['0'],
        thumb: [''],
        open_type: ['0'],
        open_rule: [''],
        edit_type: ['1'],
        source_url: [''],
        source_author: [''],
        is_hide: [0],
        weather: [''],
        audio_url: [''],
        video_url: [''],
        cc_license: [''],
        comment_status: [''],
        seo_title: [''],
        seo_description: [''],
        seo_link: [''],
    });

    public data: IBlog;
    public tagItems: ITag[] = [];
    public categories: ICategory[] = [];
    public languages: string[] = [];
    public weathers: IItem[] = [];
    public licenses: IItem[] = [];
    public tags: ITag[] = [];

    constructor(
        private fb: FormBuilder,
        private service: BlogService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {
        this.service.editOption().subscribe(res => {
            this.tagItems = res.tags;
            this.categories = res.categories;
            this.languages = res.languages;
            this.weathers = res.weathers;
            this.licenses = res.licenses;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.loadDetail(params.id);
        });
    }

    get pageLink() {
        return '/blog/' + this.form.get('seo_link').value;
    }

    get metaSize() {
        return this.form.get('description').value.length;
    }

    public loadDetail(id: number, language?: string) {
        if (this.data && this.data.id === id) {
            return;
        }
        if (id < 1) {
            this.data.parent_id = this.data.parent_id > 0 ? this.data.parent_id : this.data.id;
            this.data.id = 0;
            this.data.language = language as any;
            this.form.patchValue({
                title: '',
                content: '',
            });
            return;
        }
        this.service.blog(id).subscribe(res => {
            this.data = res;
            this.tags = res.tags || [];
            this.form.patchValue({
                title: res.title,
                content: res.content,
                keywords: res.keywords,
                description: res.description,
                term_id: res.term_id,
                programming_language: res.programming_language,
                type: res.type,
                thumb: res.thumb,
                open_type: res.open_type,
                open_rule: res.open_rule,
                edit_type: res.edit_type,
                source_url: res.source_url,
                source_author: res.source_author,
                is_hide: res.is_hide,
                weather: res.weather,
                audio_url: res.audio_url,
                video_url: res.video_url,
                cc_license: res.cc_license,
                comment_status: res.comment_status,
                seo_title: res.seo_title,
                seo_description: res.seo_description,
                seo_link: res.seo_link,
            });
        });
    }

    public get typeInput() {
        return this.form.get('type');
    }

    public get openType() {
        return this.form.get('open_type');
    }

    public get ruleLabel() {
        const val = parseInt(this.openType.value, 10);
        if (val < 5) {
            return '';
        }
        if (val === 5) {
            return '阅读密码';
        }
        if (val === 6) {
            return '购买价格';
        }
        return '规则';
    }

    public addTagFn(name: string) {
        return {name};
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IBlog = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (this.data && this.data.language) {
            data.language = this.data.language;
        }
        data.tags = this.tags;
        e?.enter();
        this.service.blogSave(data).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success('保存成功');
                this.tapBack();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }

    public editorImageUpload(event: IImageUploadEvent) {
        this.uploadService.uploadImages(event.files).subscribe(res => {
            for (const item of res) {
                event.target.insertImage(item.url, item.original);
            }
        });
    }

}
