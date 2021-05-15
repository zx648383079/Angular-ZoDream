import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-property',
  templateUrl: './editor-property.component.html',
  styleUrls: ['./editor-property.component.scss']
})
export class EditorPropertyComponent {

    public panelToggle: any = {
        
    };

    public panelVisible = false;

    constructor() { }


    public tapClose(e: MouseEvent) {
        e.stopPropagation();
        this.panelVisible = false;
    }

}
