import { Component } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
  selector: 'app-editor-video',
  templateUrl: './editor-video.component.html',
  styleUrls: ['./editor-video.component.scss']
})
export class EditorVideoComponent implements IEditorModal {

    public visible = false;
    public fileName = this.uploadService.uniqueGuid();
    public tabIndex = 0;
    public url = '';
    public code = '';
    public isAutoplay = false;
    public isLoading = false;
    private confirmFn: EditorModalCallback;
    constructor(
        private uploadService: FileUploadService,
    ) { }

    public open(data: any, cb: EditorModalCallback) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public uploadFile(e: any) {
        const files = e.target.files as FileList;
        this.uploadFiles(files);
    }

    public uploadFiles(files: FileList|File[]) {
        if (this.isLoading) {
            return;
        }
        if (files.length < 1) {
            return;
        }
        this.isLoading = true;
        this.uploadService.uploadVideo(files[0]).subscribe({
            next: res => {
                this.isLoading = false;
                this.url = res.url;
                this.tapConfirm();
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }

    public tapConfirm() {
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn(this.tabIndex === 2 ? {code: this.code} : {value: this.url, autoplay: this.isAutoplay});
        }
    }

}
