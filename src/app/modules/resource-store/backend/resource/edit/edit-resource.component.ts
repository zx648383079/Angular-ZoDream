import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogService } from '../../../../../components/dialog';
import { EditorBlockType, IEditorFileBlock, IImageUploadEvent } from '../../../../../components/editor';
import { ButtonEvent, UploadCustomEvent } from '../../../../../components/form';
import { FileUploadService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { FileTypeItems, ICategory, IResource, IResourceFile, ITag, MediaTypeItems } from '../../../model';
import { ResourceService } from '../../resource.service';
import { ReviewStatusItems } from '../../../../../theme/models/auth';
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
export class EditResourceComponent implements OnInit {
    private readonly service = inject(ResourceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


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
        status: '0',
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
    public tagItems$: Observable<ITag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;
    public previewTypeItems = MediaTypeItems;
    public reviewItems = ReviewStatusItems;
    public fileTypeItems = FileTypeItems;

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
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
                        status: res.status as any,
                        tags: res.tags ?? [],
                        files: res.files as any ?? []
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
        this.tagItems$ = concat(
            of([]), // default items
            this.tagInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.tagLoading = true),
                switchMap(keywords => this.service.tagList({keywords}).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.tagLoading = false),
                    map(res => res instanceof Array ? res : res.data)
                ))
            )
        );
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
                history.back();
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
            return v;
        });
    }

    public tapAddFile() {
        this.dataForm.files().value.update(v => {
            v.push({
                file_type: '0',
                file: '',
            } as any);
            return v;
        });
    }

}
