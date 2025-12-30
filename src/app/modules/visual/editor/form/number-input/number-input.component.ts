import { Component, computed, input, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    host: {
        class: 'select-with-control',
        '[class]': 'ngClass()'
    },
})
export class EditorNumberInputComponent implements FormValueControl<string> {

    public readonly label = input('');

    public unit = 'px';
    public readonly visible = signal(false);
    public unitItems: string[] = ['px', 'em', 'rem', 'vh', 'vw', '%', 'auto', 'none'];
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public readonly ngClass = computed(() => {
        return this.visible() ? 'select-focus' : '';
    });

    public toggle() {
        this.visible.update(v => !v);
    }

    public tapSelectedUnit(item: string) {
        this.unit = item;
        this.visible.set(false);
    }

}
