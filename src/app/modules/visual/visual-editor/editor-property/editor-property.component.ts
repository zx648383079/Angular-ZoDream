import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { alginOptions, WidgetType } from '../model';

@Component({
  selector: 'app-editor-property',
  templateUrl: './editor-property.component.html',
  styleUrls: ['./editor-property.component.scss']
})
export class EditorPropertyComponent {

    public panelToggle: any = {
        
    };

    public panelVisible = false;
    public tabIndex = 0;
    public widgetType = WidgetType.CONTROL;

    public alginItems = alginOptions;
    private baseHeight = 600;

    public get boxStyle() {
        return {
            height: this.baseHeight + 'px',
        };
    }

    constructor(
        private service: EditorService,
    ) {
        this.service.resize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.baseHeight = res.zoom.height - 80;
        });
        this.service.selectionChanged$.subscribe(res => {
            if (res.length != 1) {
                this.panelVisible = false;
                return;
            }
            this.panelVisible = true;
        });
    }

    public tapClose(e: MouseEvent) {
        e.stopPropagation();
        this.panelVisible = false;
    }

}
