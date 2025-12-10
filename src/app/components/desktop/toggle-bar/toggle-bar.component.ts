import { Component, effect, input, model } from '@angular/core';
import { IItem } from '../../../theme/models/seo';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-toggle-bar',
    templateUrl: './toggle-bar.component.html',
    styleUrls: ['./toggle-bar.component.scss'],
})
export class ToggleBarComponent implements FormValueControl<any> {

    public readonly items = input<(IItem | string)[]>([]);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<any>();
    public selectedIndex = 0;
    public iconStyle: any = {};

    constructor() {
        effect(() => this.writeValue(this.value()));
    }

    public format(item: IItem|string) {
        return typeof item === 'object' ? item.name : item;
    }

    public tapSelected(index: number) {
        if (this.disabled) {
            return;
        }
        this.updateIndex(index);
        this.output();
    }

    private itemValue(item: any, index: number) {
        return typeof item === 'object' ? item.value : index;
    }

    private output() {
        this.value.set(this.itemValue(this.items()[this.selectedIndex], this.selectedIndex));
    }

    private updateIndex(i: number) {
        this.selectedIndex = i;
        this.iconStyle = {
            left: i * 3 + 'em'
        };
    }

    private writeValue(obj: any): void {
        for (let i = 0; i < this.items().length; i++) {
            if (this.itemValue(this.items()[i], i) == obj) {
                this.updateIndex(i);
                break;
            }
        }
    }
}
