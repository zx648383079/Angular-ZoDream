import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-map',
    templateUrl: './editor-map.component.html',
    styleUrls: ['./editor-map.component.scss']
})
export class EditorMapComponent implements IEditorModal {

    public readonly visible = signal(false);
    public readonly coordinate = signal('');
    public readonly title = signal('');
    private confirmFn?: EditorModalCallback;

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                value: this.coordinate(),
                title: this.title(),
            });
        }
    }

}
