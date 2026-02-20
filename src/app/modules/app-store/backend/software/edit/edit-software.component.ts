import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from '../../../../../components/dialog';
import { EditorBlockType, IEditorFileBlock, IImageUploadEvent } from '../../../../../components/editor';
import { ButtonEvent, NetSource } from '../../../../../components/form';
import { FileUploadService } from '../../../../../theme/services';
import { ICategory, ISoftware, ITag } from '../../../model';
import { AppService } from '../../app.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-software',
    templateUrl: './edit-software.component.html',
    styleUrls: ['./edit-software.component.scss']
})
export class EditSoftwareComponent {
    private readonly service = inject(AppService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        keywords: '',
        content: '',
        description: '',
        cat_id: '',
        icon: '',
        is_free: true,
        is_open_source: false,
        official_website: '',
        git_url: '',
        score: 10,
        tags: <ITag[]>[]
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.content);
        required(schemaPath.cat_id);
    });
    public categories: ICategory[] = [];
    public readonly tagSource = this.service.tagSource();

    constructor() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.software(params.id).subscribe({
                next: res => {
                    this.dataModel.set({
                        id: res.id,
                        name: res.name,
                        keywords: res.keywords,
                        content: res.content,
                        description: res.description,
                        cat_id: res.cat_id as any,
                        icon: res.icon,
                        is_free: res.is_free > 0,
                        is_open_source: res.is_open_source > 0,
                        official_website: res.official_website,
                        git_url: res.git_url,
                        score: res.score,
                        tags: res.tags ?? []
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                    this.location.back();
                }
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public addTagFn(name: string) {
        return {name};
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
        const data: ISoftware = this.dataForm().value() as any;
        e?.enter();
        this.service.softwareSave(data).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.location.back();
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
                event.target.insert(<IEditorFileBlock>{
                    type: EditorBlockType.AddImage,
                    value: item.url,
                    title: item.original,
                    size: item.size
                });
            }
        });
    }
}
