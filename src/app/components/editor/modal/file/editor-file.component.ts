import { Component, inject } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
  selector: 'app-editor-file',
  templateUrl: './editor-file.component.html',
  styleUrls: ['./editor-file.component.scss']
})
export class EditorFileComponent implements IEditorModal {
    private uploadService = inject(FileUploadService);


    public visible = false;
    public fileName = this.uploadService.uniqueGuid();
    public isLoading = false;
    private confirmFn: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public uploadFile(e: any) {
        if (this.isLoading) {
            return;
        }
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
        this.uploadService.uploadFile(files[0]).subscribe({
            next: res => {
                this.isLoading = false;
                this.tapConfirm(res.url, res.original, res.size);
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }
    public tapConfirm(value: string, title: string, size: number) {
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn({
                value,
                title,
                size
            });
        }
    }
}
