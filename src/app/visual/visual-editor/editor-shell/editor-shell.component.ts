import { Component, EventEmitter, Output } from '@angular/core';
import { IPoint } from '../model';

@Component({
  selector: 'app-editor-shell',
  templateUrl: './editor-shell.component.html',
  styleUrls: ['./editor-shell.component.scss']
})
export class EditorShellComponent {

    public tabVisible = false;

    @Output() public resizing = new EventEmitter<IPoint>();

    constructor() { }


    public onMoveStart(event: MouseEvent) {
        event.stopPropagation();
        this.resizing.emit({x: event.clientX, y: event.clientY});
    }
}
