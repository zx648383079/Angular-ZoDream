import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-text',
    templateUrl: './editor-text.component.html',
    styleUrls: ['./editor-text.component.scss']
})
export class EditorTextComponent implements IEditorModal {

    public readonly visible = signal(false);
    public value = '';
    public label = '文字';
    private confirmFn: EditorModalCallback;

    public tapBack() {
        
    }

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                value: this.value
            });
        }
    }
}
