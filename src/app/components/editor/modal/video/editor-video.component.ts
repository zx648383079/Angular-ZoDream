import { Component, inject, signal } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-video',
    templateUrl: './editor-video.component.html',
    styleUrls: ['./editor-video.component.scss']
})
export class EditorVideoComponent implements IEditorModal {
    private readonly uploadService = inject(FileUploadService);


    public readonly visible = signal(false);
    public fileName = this.uploadService.uniqueGuid();
    public readonly tabIndex = signal(0);
    public url = '';
    public code = '';
    public isAutoplay = false;
    public readonly isLoading = signal(false);
    private confirmFn: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public uploadFile(e: any) {
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
        this.uploadService.uploadVideo(files[0]).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.url = res.url;
                this.tapConfirm();
            },
            error: () => {
                this.isLoading.set(false);
            }
        })
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn(this.tabIndex() === 2 ? {code: this.code} : {value: this.url, autoplay: this.isAutoplay});
        }
    }

}
