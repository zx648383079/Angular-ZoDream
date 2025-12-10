import { Component, OnInit, input, output } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-bool-input',
    templateUrl: './bool-input.component.html',
    styleUrls: ['./bool-input.component.scss']
})
export class BoolInputComponent {

    public readonly value = input(1);
    public readonly editable = input(true);
    public readonly valueChange = output<number>();
    public items: IItem[] = [
        {name: '对', value: 1},
        {name: '错', value: 0},
    ];

    constructor() { }

    public tapSelected(item: IItem) {
        if (!this.editable()) {
            return;
        }
        this.valueChange.emit(this.value = item.value as number);
    }
}
