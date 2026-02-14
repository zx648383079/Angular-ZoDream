import { Component, HostListener, afterNextRender, inject } from '@angular/core';
import { EditorService } from './editor.service';

@Component({
    standalone: false,
    selector: 'app-visual-editor',
    templateUrl: './visual-editor.component.html',
    styleUrls: ['./visual-editor.component.scss']
})
export class VisualEditorComponent {
    private readonly service = inject(EditorService);


    public editable = true;

    constructor() {
        afterNextRender({
            write: () => this.refreshSize()
        });
    }

    @HostListener('window:resize')
    public onResize() {
        this.refreshSize();
    }

    private refreshSize() {
        const top = 48;
        this.service.windowSize$.next({
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.service.editorSize$.next({
            x: 0,
            y: top,
            width: this.service.windowSize$.value.width - 2,
            height: this.service.windowSize$.value.height - top - 2
        });
    }


    public toggleEdit() {
        this.editable = !this.editable;
    }

}
