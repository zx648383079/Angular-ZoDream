import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-switch-input',
    templateUrl: './switch-input.component.html',
    styleUrls: ['./switch-input.component.scss'],
    host: {
        class: 'control-inline-group',
    },
})
export class EditorSwitchInputComponent implements FormValueControl<boolean> {

    public readonly header = input<string>('');
    public readonly disabled = input<boolean>(false);
    public readonly value = model<boolean>(false);

    public get isEmpty() {
        return !this.value;
    }

    public tapEmpty() {
        this.value.set(false);
    }
}
