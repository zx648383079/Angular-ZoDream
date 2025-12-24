import { Component, OnInit, inject, signal } from '@angular/core';
import { EditorService } from '../editor.service';
import { WidgetPreview, WidgetSource, WidgetType } from '../model';

@Component({
    standalone: false,
    selector: 'app-editor-soul',
    templateUrl: './editor-soul.component.html',
    styleUrls: ['./editor-soul.component.scss']
})
export class EditorSoulComponent implements OnInit {
    private readonly service = inject(EditorService);


    public readonly tabIndex = signal(0);
    public controlItems: WidgetPreview[] = [];
    public panelItems: WidgetPreview[] = [];
    public bodyStyle: any = {};

    ngOnInit() {
        this.service.editorSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.bodyStyle = {
                height: res.height - 40 - 32 + 'px'
            };
        });
        for (const item of this.service.widgetItems) {
            if (item.type === WidgetType.CONTROL) {
                this.controlItems.push(item);
            } else if (item.type === WidgetType.PANEL) {
                this.panelItems.push(item);
            }
        }
    }

    public tapWidget(item: WidgetPreview) {
        this.service.moveWidget$.next({
            data: item,
        });
    }

    public moveWidget(item: WidgetPreview, event: MouseEvent) {
        this.service.moveWidget$.next({
            data: item,
            start: {
                x: event.clientX,
                y: event.clientY,
            }
        });
    }

}
