import { Component, output } from '@angular/core';
import { IPoint } from '../../../../theme/utils/canvas';

@Component({
    standalone: false,
    selector: 'app-editor-shell',
    templateUrl: './editor-shell.component.html',
    styleUrls: ['./editor-shell.component.scss']
})
export class EditorShellComponent {

    public tabVisible = false;

    public readonly resizing = output<IPoint>();

    public onMoveStart(event: MouseEvent) {
        event.stopPropagation();
        this.resizing.emit({x: event.clientX, y: event.clientY});
    }
}
