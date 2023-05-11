import { Component } from '@angular/core';
import { FileUploadService } from '../../../../theme/services';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
  selector: 'app-editor-file',
  templateUrl: './editor-file.component.html',
  styleUrls: ['./editor-file.component.scss']
})
export class EditorFileComponent implements IEditorModal {

    public visible = false;
    public fileName = this.uploadService.uniqueGuid();
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
        if (this.isLoading) {
            return;
        }
        const files = e.target.files as FileList;
        if (files.length < 1) {
            return;
        }
        this.isLoading = true;
        this.uploadService.uploadFile(files[0]).subscribe({
            next: res => {
                this.isLoading = false;
                this.tapConfirm(res.url);
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }

    public tapConfirm(value: string) {
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn({
                value
            });
        }
    }
}
