import { Component } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
  selector: 'app-editor-code',
  templateUrl: './editor-code.component.html',
  styleUrls: ['./editor-code.component.scss']
})
export class EditorCodeComponent implements IEditorModal {

    public visible = false;
    public language = '';
    public code = '';
    private confirmFn: EditorModalCallback;

    constructor() { }

    public open(data: any, cb: EditorModalCallback) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn({
                value: this.code,
                language: this.language
            });
        }
    }
}
