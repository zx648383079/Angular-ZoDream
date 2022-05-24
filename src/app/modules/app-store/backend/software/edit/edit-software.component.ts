import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogService } from '../../../../../components/dialog';
import { IImageUploadEvent } from '../../../../../components/editor';
import { ButtonEvent } from '../../../../../components/form';
import { FileUploadService } from '../../../../../theme/services';
import { ICategory, ISoftware, ITag } from '../../../model';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-edit-software',
    templateUrl: './edit-software.component.html',
    styleUrls: ['./edit-software.component.scss']
})
export class EditSoftwareComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        keywords: [''],
        content: ['', Validators.required],
        description: [''],
        cat_id: [0, Validators.required],
        icon: [''],
        is_free: [1],
        is_open_source: [0],
        official_website: [''],
        git_url: [''],
        score: [10],
    });
    public data: ISoftware;
    public tags: ITag[] = [];
    public categories: ICategory[] = [];
    public tagItems$: Observable<ITag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;

    constructor(
        private fb: FormBuilder,
        private service: AppService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) { }

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
                    this.data = res;
                    if (res.tags) {
                        this.tags = res.tags;
                    }
                    this.form.patchValue({
                        name: res.name,
                        keywords: res.keywords,
                        content: res.content,
                        description: res.description,
                        cat_id: res.cat_id,
                        icon: res.icon,
                        is_free: res.is_free,
                        is_open_source: res.is_open_source,
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

    public get isOpenSource() {
        return this.form.get('is_open_source').value;
    }

    public addTagFn(name: string) {
        return {name};
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: ISoftware = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.tags = this.tags;
        e?.enter();
        this.service.softwareSave(data).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success('保存成功');
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
                event.target.insertImage(item.url, item.original);
            }
        });
    }
}
