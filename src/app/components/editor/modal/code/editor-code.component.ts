import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-code',
    templateUrl: './editor-code.component.html',
    styleUrls: ['./editor-code.component.scss']
})
export class EditorCodeComponent implements IEditorModal {

    public readonly visible = signal(false);
    public readonly language = signal('');
    public readonly code = signal('');
    private confirmFn: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                value: this.code(),
                language: this.language()
            });
        }
    }

    public onValueChange(e: Event) {
        this.code.set((e.target as HTMLTextAreaElement).value);
    }
}
