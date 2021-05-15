import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IPoint } from '../model';

@Component({
  selector: 'app-editor-shell',
  templateUrl: './editor-shell.component.html',
  styleUrls: ['./editor-shell.component.scss']
})
export class EditorShellComponent implements OnInit {

    public tabVisible = false;

    @Output() public resizing = new EventEmitter<IPoint>();

    constructor() { }

    ngOnInit() {
    }


    public onMoveStart(event: MouseEvent) {
        this.resizing.emit({x: event.clientX, y: event.clientY});
    }
}
