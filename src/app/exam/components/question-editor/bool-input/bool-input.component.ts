import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IItem } from '../../../../theme/models/seo';

@Component({
    selector: 'app-bool-input',
    templateUrl: './bool-input.component.html',
    styleUrls: ['./bool-input.component.scss']
})
export class BoolInputComponent {

    @Input() public value = 1;
    @Input() public editable = true;
    @Output() public valueChange = new EventEmitter<number>();
    public items: IItem[] = [
        {name: '对', value: 1},
        {name: '错', value: 0},
    ];

    constructor() { }

    public tapSelected(item: IItem) {
        if (!this.editable) {
            return;
        }
        this.valueChange.emit(this.value = item.value as number);
    }
}
