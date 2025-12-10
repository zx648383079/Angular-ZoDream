import { Component, OnInit, input } from '@angular/core';

@Component({
    standalone: false,
  selector: 'app-editor-map-panel',
  templateUrl: './editor-map-panel.component.html',
  styleUrls: ['./editor-map-panel.component.scss']
})
export class EditorMapPanelComponent implements OnInit {

    public readonly visible = input(false);
    public readonly targetId = input(0);

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
