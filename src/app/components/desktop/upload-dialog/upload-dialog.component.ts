import { Component, input, model, signal } from '@angular/core';
import { ButtonEvent } from '../../form';
import { ManageDialogEvent } from '../../dialog';

@Component({
    standalone: false,
    selector: 'app-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements ButtonEvent, ManageDialogEvent<File> {

    /**
     * 标题
     */
    public readonly title = model($localize `Upload file`);
    public readonly placeholder = input($localize `Please enter the operation note information`);
    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly confirmText = input($localize `Ok`);
    public readonly cancelText = input($localize `Cancel`);
    public readonly isLoading = signal(false);
    public readonly fileName = 'zre_file_a';
    /**
     * 确认事件
     */
    private confirmFn: (data: File) => boolean|void;


    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close(result?: File) {
        if (typeof result === 'undefined') {
            this.visible.set(false);
            return;
        }
        if (!result) {
            this.visible.set(false);
            return;
        }
        if (this.confirmFn && this.confirmFn(result) === false) {
            return;
        }
        this.visible.set(false);
    }

    public open(confirm: (data: File) => boolean|void): void;
    public open(confirm: (data: File) => boolean|void, title: string): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(confirm: (data: File) => boolean|void, title?: string) {
        this.confirmFn = confirm;
        if (title) {
            this.title.set(title);
        }
        this.visible.set(true);
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
        this.isLoading.set(true);
    }
}
