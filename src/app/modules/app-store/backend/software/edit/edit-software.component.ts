import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogService } from '../../../../../components/dialog';
import { EditorBlockType, IEditorFileBlock, IImageUploadEvent } from '../../../../../components/editor';
import { ButtonEvent } from '../../../../../components/form';
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
export class EditSoftwareComponent implements OnInit {
    private readonly service = inject(AppService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


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
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.content);
        required(schemaPath.cat_id);
    });
    public tags: ITag[] = [];
    public categories: ICategory[] = [];
    public tagItems$: Observable<ITag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.software(params.id).subscribe({
                next: res => {
                    if (res.tags) {
                        this.tags = res.tags;
                    }
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

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ISoftware = this.dataForm().value() as any;
        data.tags = this.tags;
        e?.enter();
        this.service.softwareSave(data).subscribe({
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
}
