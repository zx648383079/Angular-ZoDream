import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-number-slider-input',
    templateUrl: './number-slider-input.component.html',
    styleUrls: ['./number-slider-input.component.scss']
})
export class EditorNumberSliderInputComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public readonly hasUnit = input(true);
    public isEmpty = false;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }

}
