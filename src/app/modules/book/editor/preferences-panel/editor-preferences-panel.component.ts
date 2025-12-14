import { Component, inject, input } from '@angular/core';
import { BookService } from '../book.service';

@Component({
    standalone: false,
    selector: 'app-editor-preferences-panel',
    templateUrl: './editor-preferences-panel.component.html',
    styleUrls: ['./editor-preferences-panel.component.scss'],
})
export class EditorPreferencesPanelComponent {
    private readonly service = inject(BookService);

    public visible = false;
    public readonly targetId = input(0);
    public subOpen = false;
    public items: any[] = [];
    private booted = false;

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
