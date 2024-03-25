import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-map-panel',
  templateUrl: './editor-map-panel.component.html',
  styleUrls: ['./editor-map-panel.component.scss']
})
export class EditorMapPanelComponent implements OnInit {

    @Input() public visible = false;
    @Input() public targetId = 0;

    constructor() { }

    ngOnInit() {
    }

    public open() {
        this.visible = true;
    }
    public close() {
        this.visible = false
    }
}
