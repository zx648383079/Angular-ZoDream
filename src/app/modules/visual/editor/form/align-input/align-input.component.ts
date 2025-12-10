import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-align-input',
    templateUrl: './align-input.component.html',
    styleUrls: ['./align-input.component.scss'],
    host: {
        class: 'control-line-group',
    },
})
export class EditorAlignInputComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }
}
