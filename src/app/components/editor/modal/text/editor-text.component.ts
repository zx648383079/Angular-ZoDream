import { Component } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  styleUrls: ['./editor-text.component.scss']
})
export class EditorTextComponent implements IEditorModal {

    public visible = false;
    public value = '';
    public label = '文字';
    private confirmFn: EditorModalCallback;

    constructor() { }

    public tapBack() {
        
    }

    public open(data: any, cb: EditorModalCallback) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn({
                value: this.value
            });
        }
    }
}
