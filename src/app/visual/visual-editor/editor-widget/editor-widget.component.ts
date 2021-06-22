import { Component, Input, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { Widget } from '../model';

@Component({
  selector: 'app-editor-widget',
  templateUrl: './editor-widget.component.html',
  styleUrls: ['./editor-widget.component.scss']
})
export class EditorWidgetComponent {

    @Input() public value: Widget;

    constructor(
        private service: EditorService,
    ) { }

    public tapWidget() {

    }

    public moveWidget(event: MouseEvent) {
        this.service.editWidget$.next(this.value);
    }

    public onMouseEnter() {

    }

    public onMouseLeave() {
        
    }

}
