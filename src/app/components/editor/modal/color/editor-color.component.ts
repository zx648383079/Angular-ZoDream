import { Component } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
  selector: 'app-editor-color',
  templateUrl: './editor-color.component.html',
  styleUrls: ['./editor-color.component.scss']
})
export class EditorColorComponent implements IEditorModal {

    public visible = false;
    public color = '';
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
                value: this.color
            });
        }
    }
}
