import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-shadow-popup',
    templateUrl: './shadow-popup.component.html',
    styleUrls: ['./shadow-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
})
export class EditorShadowPopupComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public visible = false;

    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }
    
}
