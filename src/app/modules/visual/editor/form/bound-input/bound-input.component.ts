import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-bound-input',
    templateUrl: './bound-input.component.html',
    styleUrls: ['./bound-input.component.scss'],
    host: {
        class: 'control-line-group'
    },
})
export class EditorBoundInputComponent implements FormValueControl<string> {

    public readonly header = input<string>('');

    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }
    

}
