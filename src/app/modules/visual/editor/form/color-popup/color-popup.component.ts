import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-color-popup',
    templateUrl: './color-popup.component.html',
    styleUrls: ['./color-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
})
export class EditorColorPopupComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public visible = false;
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }
    
}
