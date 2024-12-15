import { Component, Input } from '@angular/core';
import { BookService } from '../book.service';
import { PanelAnimation } from '../../../../theme/constants';

@Component({
    standalone: false,
    selector: 'app-editor-preferences-panel',
    templateUrl: './editor-preferences-panel.component.html',
    styleUrls: ['./editor-preferences-panel.component.scss'],
    animations: [
        PanelAnimation
    ],
})
export class EditorPreferencesPanelComponent {
    @Input() public visible = false;
    @Input() public targetId = 0;
    public subOpen = false;
    public items: any[] = [];
    private booted = false;

    constructor(
        private service: BookService,
    ) { }

    public open() {
        this.visible = true;
    }
    public close() {
        this.subOpen = this.visible = false
    }

    public tapAdd() {
        this.subOpen = true;
    }
}
