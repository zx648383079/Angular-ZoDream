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
import { parseNumber } from '../../../../theme/utils';

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
        publish_status: [0],
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
    public statusItems: IItem[] = [];
    public openItems: IItem[] = [];

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
            this.statusItems = res.publish_status;
            this.openItems = res.open_types;
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

    get publishStatus() {
        return this.form.get('publish_status').value;
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
                type: res.type as any,
                thumb: res.thumb,
                open_type: res.open_type as any,
                open_rule: res.open_rule,
                edit_type: res.edit_type as any,
                source_url: res.source_url,
                source_author: res.source_author,
                is_hide: res.is_hide,
                weather: res.weather,
                audio_url: res.audio_url,
                video_url: res.video_url,
                cc_license: res.cc_license,
                publish_status: res.publish_status,
                comment_status: res.comment_status as any,
                seo_title: res.seo_title,
                seo_description: res.seo_description,
                seo_link: res.seo_link,
            });
        });
    }

    public get typeValue() {
        return parseNumber(this.form.get('type').value);
    }

    public get openType() {
        return parseNumber(this.form.get('open_type').value);
    }

    public get ruleLabel() {
        const val = this.openType;
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

    public tapSubmit(e?: ButtonEvent, status?: number) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IBlog = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (this.data && this.data.language) {
            data.language = this.data.language;
        }
        if (typeof status === 'number') {
            data.publish_status = status;
        }
        data.tags = this.tags;
        e?.enter();
        this.service.blogSave(data).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success($localize `Save Successfully`);
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
