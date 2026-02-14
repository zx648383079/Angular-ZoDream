import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-mask-input',
    templateUrl: './mask-input.component.html',
    styleUrls: ['./mask-input.component.scss'],
})
export class EditorMaskInputComponent implements FormValueControl<string> {

    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

}
