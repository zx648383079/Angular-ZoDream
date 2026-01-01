import { Component, OnInit, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-size',
    templateUrl: './editor-size.component.html',
    styleUrls: ['./editor-size.component.scss']
})
export class EditorSizeComponent implements IEditorModal {

    public readonly visible = signal(false);
    public readonly width = signal('');
    public readonly height = signal('');
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
                height: this.height(),
                width: this.width()
            });
        }
    }
}
