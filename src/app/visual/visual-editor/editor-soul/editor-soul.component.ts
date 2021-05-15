import { Component, NgZone, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { WidgetPreview, WidgetSource, WidgetType } from '../model';

@Component({
  selector: 'app-editor-soul',
  templateUrl: './editor-soul.component.html',
  styleUrls: ['./editor-soul.component.scss']
})
export class EditorSoulComponent implements OnInit {

    public tabIndex = 0;
    public controlItems: WidgetPreview[] = [];
    public panelItems: WidgetPreview[] = [];
    constructor(
        private readonly service: EditorService,
    ) { }

    ngOnInit() {
        for (const item of this.service.widgetItems) {
            if (item.type === WidgetType.CONTROL) {
                this.controlItems.push(item);
            } else if (item.type === WidgetType.PANEL) {
                this.panelItems.push(item);
            }
        }
    }

    public tapWidget(item: WidgetSource) {
        this.service.moveWidget$.next({
            data: item,
        });
    }

    public moveWidget(item: WidgetSource, event: MouseEvent) {
        this.service.moveWidget$.next({
            data: item,
            start: {
                x: event.clientX,
                y: event.clientY,
            }
        });
    }

}
