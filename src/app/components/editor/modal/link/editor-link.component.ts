import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-link',
    templateUrl: './editor-link.component.html',
    styleUrls: ['./editor-link.component.scss']
})
export class EditorLinkComponent implements IEditorModal {

    public readonly visible = signal(false);
    public readonly url = signal('');
    public readonly title = signal('');
    public readonly isBlank = signal(false);
    private confirmFn: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                value: this.url(),
                title: this.title(),
                target: this.isBlank()
            });
        }
    }

    public toggleBlank() {
        this.isBlank.update(v => !v);
    }
}
