import { Component, OnInit } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
  selector: 'app-editor-size',
  templateUrl: './editor-size.component.html',
  styleUrls: ['./editor-size.component.scss']
})
export class EditorSizeComponent implements IEditorModal {

    public visible = false;
    public width = '';
    public height = '';
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
                height: this.height,
                width: this.width
            });
        }
    }
}
