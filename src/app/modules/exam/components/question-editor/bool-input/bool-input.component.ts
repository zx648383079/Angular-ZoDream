import { Component, input, model } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-bool-input',
    templateUrl: './bool-input.component.html',
    styleUrls: ['./bool-input.component.scss']
})
export class BoolInputComponent {

    public readonly value = model(1);
    public readonly editable = input(true);
    public items: IItem[] = [
        {name: '对', value: 1},
        {name: '错', value: 0},
    ];

    constructor() { }

    public tapSelected(item: IItem) {
        if (!this.editable()) {
            return;
        }
        this.value.set(item.value);
    }
}
