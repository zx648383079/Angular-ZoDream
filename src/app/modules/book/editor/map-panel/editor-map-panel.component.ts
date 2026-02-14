import { Component, input, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-editor-map-panel',
    templateUrl: './editor-map-panel.component.html',
    styleUrls: ['./editor-map-panel.component.scss']
})
export class EditorMapPanelComponent {

    public readonly visible = signal(false);
    public readonly targetId = input(0);

    public open() {
        this.visible.set(true);
    }
    public close() {
        this.visible.set(false);
    }
}
