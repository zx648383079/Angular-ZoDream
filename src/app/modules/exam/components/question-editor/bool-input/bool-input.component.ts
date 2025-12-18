import { Component, input, model } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bool-input',
    templateUrl: './bool-input.component.html',
    styleUrls: ['./bool-input.component.scss']
})
export class BoolInputComponent implements FormValueControl<number> {

    public readonly value = model(1);
    public readonly disabled = input(false);
    public items: IItem[] = [
        {name: '对', value: 1},
        {name: '错', value: 0},
    ];

    public tapSelected(item: IItem) {
        if (this.disabled()) {
            return;
        }
        this.value.set(item.value);
    }
}
