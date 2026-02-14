import { Component, computed, DestroyRef, inject, input, model, signal } from '@angular/core';
import { ButtonEvent } from '../../form';
import { asyncScheduler, filter, Subject, throttleTime } from 'rxjs';
import { HttpProgressEvent } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements ButtonEvent {

    private readonly destroyRef = inject(DestroyRef);
    /**
     * 标题
     */
    public readonly title = model($localize `Upload file`);
    public readonly placeholder = input($localize `Uploading in progress. Please wait...`);
    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly confirmText = input($localize `Ok`);
    public readonly cancelText = input($localize `Cancel`);
    public readonly accept = input('image/*');
    public readonly multiple = input(false);
    public readonly isLoading = signal(false);
    public readonly password = signal('');
    public readonly selectedItem = signal('');
    public readonly stepIndex = signal(0);
    public readonly fileName = 'zre_file_a';
    public readonly max = signal(0);
    public readonly value = signal(0);

    private readonly progress$ = new Subject<HttpProgressEvent>();


    public readonly progressStyle = computed(() => {
        const max = this.max();
        const value = this.value();
        return {
            width: max > 0 ? (value * 100 / max).toFixed(2) + '%' : '0',
        };
    });
    /**
     * 确认事件
     */
    private confirmFn: (data: FormData) => void;
    private lastFile: FileList|File[];

    constructor() {
        this.progress$.pipe(
            throttleTime(100, asyncScheduler, { leading: false, trailing: true }),
            filter(_ => this.visible()),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(res => {
            this.value.set(res.loaded);
            this.max.set(res.total ?? 0);
            if (!res.total) {
                this.isLoading.set(true);
                return;
            }
            this.isLoading.set(false);
        });
    }

    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close(isOk = false) {
        if (!isOk || !this.lastFile || !this.confirmFn || this.stepIndex() > 0) {
            this.visible.set(false);
            return;
        }
        const form = new FormData();
        if (this.multiple()) {
            for (let i = 0; i < this.lastFile.length; i++) {
                form.append('file[]', this.lastFile[i], this.lastFile[i].name);
            }
        } else {
            form.append('file', this.lastFile[0]);
        }
        
        form.append('password', this.password() ?? '');
        this.confirmFn(form);
        this.stepIndex.set(1);
    }

    public tapMaskClose() {
        if (this.stepIndex() > 0) {
            return;
        }
        this.close();
    }

    public open(confirm: (data: FormData) => boolean|void): Subject<HttpProgressEvent>;
    public open(confirm: (data: FormData) => boolean|void, title: string): Subject<HttpProgressEvent>;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(confirm: (data: FormData) => boolean|void, title?: string): Subject<HttpProgressEvent> {
        this.selectedItem.set('');
        this.stepIndex.set(0);
        this.confirmFn = confirm;
        if (title) {
            this.title.set(title);
        }
        this.visible.set(true);
        return this.progress$;
    }

    public enter() {
        this.isLoading.set(true);
    }
    public reset() {
        this.isLoading.set(false);
    }

    public uploadFile(e: any) {
        if (this.isLoading()) {
            return;
        }
        const files = e.target.files as FileList;
        this.uploadFiles(files);
    }

    public uploadFiles(files: FileList|File[]) {
        if (this.isLoading()) {
            return;
        }
        if (files.length < 1) {
            return;
        }
        this.lastFile = files;
        this.selectedItem.set(files.length > 1 ? `${files[0].name}...(${files.length})` : files[0].name);
    }
}
