import { Component, inject, signal } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-file',
    templateUrl: './editor-file.component.html',
    styleUrls: ['./editor-file.component.scss']
})
export class EditorFileComponent implements IEditorModal {
    private readonly uploadService = inject(FileUploadService);


    public readonly visible = signal(false);
    public fileName = this.uploadService.uniqueGuid();
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
        this.uploadService.uploadFile(files[0]).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.tapConfirm(res.url, res.original, res.size);
            },
            error: () => {
                this.isLoading.set(false);
            }
        })
    }
    public tapConfirm(value: string, title: string, size: number) {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                value,
                title,
                size
            });
        }
    }
}
