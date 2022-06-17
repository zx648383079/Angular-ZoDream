import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogService } from '../../../../../components/dialog';
import { IImageUploadEvent } from '../../../../../components/editor';
import { ButtonEvent, UploadCustomEvent } from '../../../../../components/form';
import { FileUploadService } from '../../../../../theme/services';
import { ICategory, IResource, IResourceFile, ITag } from '../../../model';
import { ResourceService } from '../../resource.service';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.scss']
})
export class EditResourceComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        thumb: [''],
        keywords: [''],
        content: ['', Validators.required],
        description: [''],
        cat_id: [0, Validators.required],
        type: [0],
        size: [0],
        price: [0],
        is_commercial: [0],
        is_reprint: [0],
    });
    public data: IResource;
    public fileItems: IResourceFile[] = [];
    public tags: ITag[] = [];
    public categories: ICategory[] = [];
    public tagItems$: Observable<ITag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;
    public typeItems = ['HTML模板', '脚本', '图片', '源码', '3D模型', '音乐'];
    public fileTypeItems = ['文件', '网址', '网盘', '种子'];

    constructor(
        private fb: FormBuilder,
        private service: ResourceService,
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
            this.service.resource(params.id).subscribe({
                next: res => {
                    this.data = res;
                    if (res.tags) {
                        this.tags = res.tags;
                    }
                    if (res.files) {
                        this.fileItems = res.files;
                    }
                    this.form.patchValue({
                        title: res.title,
                        thumb: res.thumb,
                        type: res.type,
                        keywords: res.keywords,
                        content: res.content,
                        description: res.description,
                        cat_id: res.cat_id,
                        size: res.size,
                        price: res.price,
                        is_commercial: res.is_commercial,
                        is_reprint: res.is_reprint,
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

    public onFileUpload(e: UploadCustomEvent) {
        this.service.upload(e.file).subscribe({
            next: res => {
                e.next(res);
            },
            error: err => {
                this.toastrService.error(err);
                e.next();
            }
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        if (this.fileItems.length < 1) {
            this.toastrService.warning('请上传文件');
            return;
        }
        const data: IResource = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.tags = this.tags;
        data.files = this.fileItems;
        e?.enter();
        this.service.resourceSave(data).subscribe({
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

    public tapRemoveFile(i: number) {
        this.fileItems.splice(i, 1);
    }

    public tapAddFile() {
        this.fileItems.push({
            file_type: 0,
            file: '',
        } as any);
    }

}
