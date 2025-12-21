import { Component, inject, input, signal } from '@angular/core';
import { BookService } from '../book.service';

@Component({
    standalone: false,
    selector: 'app-editor-preferences-panel',
    templateUrl: './editor-preferences-panel.component.html',
    styleUrls: ['./editor-preferences-panel.component.scss'],
})
export class EditorPreferencesPanelComponent {
    private readonly service = inject(BookService);

    public readonly visible = signal(false);
    public readonly targetId = input(0);
    public readonly subOpen = signal(false);
    public readonly items = signal<any[]>([]);
    private booted = false;

    public open() {
        this.visible.set(true);
    }
    public close() {
        this.subOpen.set(false);
        this.visible.set(false);
    }

    public tapAdd() {
        this.subOpen.set(true);
    }
}
