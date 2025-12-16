import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-position-input',
    templateUrl: './position-input.component.html',
    styleUrls: ['./position-input.component.scss'],
})
export class EditorPositionInputComponent implements FormValueControl<any> {

    public readonly header = input<string>('');
    public isEmpty = true;
    public readonly disabled = input<boolean>(false);
    public readonly value = model({
        position_type: 'static',
    });

    public tapEmpty() {

    }

    public onValueChange(e: Event) {
        this.value.update(v => {
            v.position_type = (e.target as HTMLSelectElement).value;
            return v;
        });
    }

}
