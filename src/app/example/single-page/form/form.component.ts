import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IImageUploadEvent } from '../../../components/editor';
import { ButtonEvent } from '../../../components/form';
import { IBlog, ITag } from '../../../modules/blog/model';
import { ICategory } from '../../../modules/shop/model';
import { IItem } from '../../../theme/models/seo';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-example-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class ExampleFormComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        title: '',
        keywords: '',
        content: '',
        description: '',
        term_id: '',
        programming_language: '',
        type: '0',
        thumb: '',
        open_type: '0',
        open_rule: '',
        edit_type: '1',
        source_url: '',
        source_author: '',
        is_hide: 0,
        weather: '',
        audio_url: '',
        video_url: '',
        cc_license: '',
        comment_status: '',
        publish_status: 0,
        seo_title: '',
        seo_description: '',
        seo_link: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
        required(schemaPath.term_id);
    });

    public tagItems: ITag[] = [];
    public categories: ICategory[] = [];
    public languages: string[] = [];
    public weathers: IItem[] = [];
    public licenses: IItem[] = [];
    public tags: ITag[] = [];
    public statusItems: IItem[] = [];
    public openItems: IItem[] = [];

    public addTagFn(name: string) {
        return {name};
    }

    public tapBack() {
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent, status?: number) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IBlog = this.dataForm().value() as any;
        e?.enter();
    }

    public editorImageUpload(event: IImageUploadEvent) {
    }

}
