import { Component, OnInit, inject, signal } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-image',
    templateUrl: './editor-image.component.html',
    styleUrls: ['./editor-image.component.scss']
})
export class EditorImageComponent implements IEditorModal {
    private readonly uploadService = inject(FileUploadService);


    public readonly visible = signal(false);
    public fileName = this.uploadService.uniqueGuid();
    public tabIndex = 0;
    public url = '';
    public readonly isLoading = signal(false);
    private confirmFn: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
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
        this.uploadService.uploadImage(files[0]).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.url = res.url;
                this.output({
                    value: res.url,
                    title: res.original
                });
            },
            error: () => {
                this.isLoading.set(false);
            }
        })
    }

    public tapConfirm() {
        this.output({
            value: this.url
        });
    }

    private output(data: any) {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn(data);
        }
    }
}
