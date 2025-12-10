import { Component, OnInit, inject } from '@angular/core';
import { EditorService } from '../editor.service';
import { alginOptions, WidgetType } from '../model';

@Component({
    standalone: false,
  selector: 'app-editor-property',
  templateUrl: './editor-property.component.html',
  styleUrls: ['./editor-property.component.scss']
})
export class EditorPropertyComponent {
    private service = inject(EditorService);


    public panelToggle: any = {
        
    };

    public panelVisible = false;
    public tabIndex = 0;
    public widgetType = WidgetType.CONTROL;

    public alginItems = alginOptions;

    public boxStyle: any = {};

    constructor() {
        this.service.workspaceSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.boxStyle = {
                height: res.height - 64 + 'px'
            };
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
