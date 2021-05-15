import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../model';

@Component({
  selector: 'app-editor-widget',
  templateUrl: './editor-widget.component.html',
  styleUrls: ['./editor-widget.component.scss']
})
export class EditorWidgetComponent {

    @Input() public value: Widget;

    constructor() { }

    public tapWidget() {

    }

    public moveWidget(event: MouseEvent) {

    }

}
