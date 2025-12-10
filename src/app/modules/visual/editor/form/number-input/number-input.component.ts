import { Component, HostBinding, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    host: {
        class: 'select-with-control'
    },
})
export class EditorNumberInputComponent implements FormValueControl<string> {

    public readonly label = input('');

    public unit = 'px';
    public visible = false;
    public unitItems: string[] = ['px', 'em', 'rem', 'vh', 'vw', '%', 'auto', 'none'];
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    @HostBinding('class')
    public get ngClass() {
        return this.visible ? 'select-focus' : '';
    }

    public tapSelectedUnit(item: string) {
        this.unit = item;
        this.visible = false;
    }

}
