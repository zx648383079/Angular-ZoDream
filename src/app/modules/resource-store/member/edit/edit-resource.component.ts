import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { EditorBlockType, IEditorFileBlock, IImageUploadEvent } from '../../../../components/editor';
import { FileTypeItems, ICategory, IResource, IResourceFile, ITag, MediaTypeItems } from '../../model';
import { ResourceService } from '../resource.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from '../../../../components/dialog';
import { FileUploadService, ThemeService } from '../../../../theme/services';
import { parseNumber } from '../../../../theme/utils';
import { ButtonEvent, UploadCustomEvent } from '../../../../components/form';
import { NavigationDisplayMode } from '../../../../theme/models/event';
import { form, required } from '@angular/forms/signals';

interface IResFile {
    id: number;
    res_id: number;
    file_type: string;
    file: string;
}

@Component({
    standalone: false,
    selector: 'app-edit-resource',
    templateUrl: './edit-resource.component.html',
    styleUrls: ['./edit-resource.component.scss']
})
export class EditResourceComponent {
    private readonly service = inject(ResourceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly themeService = inject(ThemeService);
    private readonly location = inject(Location);
    private readonly destroyRef = inject(DestroyRef);

    public readonly dataModel = signal({
        id: 0,
        title: '',
        thumb: '',
        keywords: '',
        content: '',
        description: '',
        cat_id: '',
        size: 0,
        price: 0,
        is_commercial: 0,
        is_reprint: 0,
        preview_type: '0',
        preview_file: '',
        tags: <ITag[]>[],
        files: <IResFile[]>[],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
        required(schemaPath.cat_id);
    });

    public readonly previewType = computed(() => parseNumber(this.dataForm.preview_type().value()));

    public data: IResource;
    public categories: ICategory[] = [];
    public readonly tagSource = this.service.tagSource();
    public previewTypeItems = MediaTypeItems;
    public fileTypeItems = FileTypeItems;

    constructor() {
        this.themeService.screenSwitch(this.destroyRef, NavigationDisplayMode.Compact);
        this.service.categoryAll().subscribe(res => {
            this.categories = res;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.resource(params.id).subscribe({
                next: res => {
                    this.data = res;
                    this.dataModel.set({
                        id: res.id,
                        title: res.title,
                        thumb: res.thumb,
                        keywords: res.keywords,
                        content: res.content,
                        description: res.description,
                        cat_id: res.cat_id as any,
                        size: res.size,
                        price: res.price,
                        is_commercial: res.is_commercial,
                        is_reprint: res.is_reprint,
                        preview_type: res.preview_type as any,
                        preview_file: res.preview_file,
                        tags: res.tags ?? [],
                        files: res.files as any ?? []
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                    this.location.back();
                }
            });
        });
    }



    public addTagFn(name: string) {
        return {name};
    }

    public onFileUpload(e: UploadCustomEvent, isPreview = false) {
        const sizeInput = this.dataForm.size();
        this.service.upload(e.file).subscribe({
            next: res => {
                if (!isPreview && !sizeInput.value()) {
                    sizeInput.value.set(res.size);
                }
                e.next(res);
            },
            error: err => {
                this.toastrService.error(err);
                e.next();
            }
        });
    }

    public tapBack() {
        this.location.back();
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
        const data = this.dataForm().value();
        if (data.files.length < 1) {
            this.toastrService.warning('请上传文件');
            return;
        }
        e?.enter();
        this.service.resourceSave(data).subscribe({
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

    public tapRemoveFile(i: number) {
        this.dataForm.files().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public tapAddFile() {
        this.dataForm.files().value.update(v => {
            v.push({
                file_type: '0',
                file: '',
            } as any);
            return [...v];
        });
    }

}
