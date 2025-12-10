import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-position-input',
    templateUrl: './position-input.component.html',
    styleUrls: ['./position-input.component.scss'],
})
export class EditorPositionInputComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public positionType = 'static';
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }


}
