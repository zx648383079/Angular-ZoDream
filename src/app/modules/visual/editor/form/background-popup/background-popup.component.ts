import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-background-popup',
    templateUrl: './background-popup.component.html',
    styleUrls: ['./background-popup.component.scss'],
    host: {
        class: 'control-inline-group',
    },
})
export class EditorBackgroundPopupComponent implements FormValueControl<string> {

    public readonly header = input<string>('');
    public visible = false;
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');

    public tapEmpty() {

    }

}
