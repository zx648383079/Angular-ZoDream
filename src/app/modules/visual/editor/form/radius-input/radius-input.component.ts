import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-radius-input',
    templateUrl: './radius-input.component.html',
    styleUrls: ['./radius-input.component.scss'],
    host: {
        class: 'control-row'
    },
})
export class EditorRadiusInputComponent implements FormValueControl<string> {

    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    
}
