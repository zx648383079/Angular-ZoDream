import { Component, OnInit, inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../components/dialog';
import { IImageUploadEvent } from '../../components/editor';
import { ButtonEvent } from '../../components/form';
import { IBlog, ITag } from '../../modules/blog/model';
import { ICategory } from '../../modules/shop/model';
import { IItem } from '../../theme/models/seo';
import { parseNumber } from '../../theme/utils';

@Component({
    standalone: false,
  selector: 'app-example-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ExampleFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


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

    ngOnInit() {
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
        if (this.data && this.data.parent_id) {
            data.parent_id = this.data.parent_id;
        }
        if (this.data && this.data.language) {
            data.language = this.data.language;
        }
        if (typeof status === 'number') {
            data.publish_status = status;
        }
        data.tags = this.tags;
        e?.enter();
    }

    public editorImageUpload(event: IImageUploadEvent) {
    }

}
