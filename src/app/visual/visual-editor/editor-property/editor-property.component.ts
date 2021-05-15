import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { alginOptions } from '../model';

@Component({
  selector: 'app-editor-property',
  templateUrl: './editor-property.component.html',
  styleUrls: ['./editor-property.component.scss']
})
export class EditorPropertyComponent implements OnInit {

    public panelToggle: any = {
        
    };

    public panelVisible = false;
    public tabIndex = 0;

    public alginItems = alginOptions;

    public get boxStyle() {
        return {
            height: 600 + 'px',
        };
    }

    constructor(
        private service: EditorService,
    ) { }


    public ngOnInit() {
        this.service.editWidget$.subscribe(res => {
            if (!res) {
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
