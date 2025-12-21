import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-color',
    templateUrl: './editor-color.component.html',
    styleUrls: ['./editor-color.component.scss']
})
export class EditorColorComponent implements IEditorModal {

    public readonly visible = signal(false);
    public color = '';
    private confirmFn: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                value: this.color
            });
        }
    }
}
