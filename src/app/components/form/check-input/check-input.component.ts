import { Component, effect, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-check-input',
    templateUrl: './check-input.component.html',
    styleUrls: ['./check-input.component.scss'],
})
export class CheckInputComponent implements FormValueControl<any> {

    public readonly items = input<any[]>([]);
    public readonly multiple = input(false);
    /**
     * 值的键名，数字表示为数组的排序，空为项，其他为项的值
     */
    public readonly rangeKey = input<any>('');
    public readonly rangeLabel = input('');

    private selectedItems: any[] = [];
    public readonly disabled = input<boolean>(false);
    public readonly value = model<any>();

    constructor() {
        effect(() => this.writeValue(this.value()));
    }

    public format(item: any) {
        if (this.rangeLabel() != '') {
            return typeof item === 'object' ? item[this.rangeLabel()] : item;
        }
        if (this.rangeKey() === 'value') {
            return item.name;
        }
        return item;
    }

    public isSelected(item: any, index: number) {
        const value = this.itemValue(item, index);
        for (const i of this.selectedItems) {
            if (value === i) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: any, index: number) {
        const value = this.itemValue(item, index);
        if (this.disabled) {
            return;
        }
        if (!this.multiple()) {
            this.selectedItems = [value];
            this.output();
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (value === this.selectedItems[i]) {
                this.selectedItems.splice(i, 1);
                this.output();
                return;
            }
        }
        this.selectedItems.push(value);
        this.output();
    }

    private itemValue(item: any, index: number) {
        const rangeKey = this.rangeKey();
        if (typeof rangeKey === 'number') {
            return index;
        }
        if (rangeKey) {
            return item[rangeKey];
        }
        return item;
    }

    private output() {
        const def = typeof this.rangeKey() === 'number' ? -1 : null;
        this.value.set(this.multiple() ? [...this.selectedItems] : (this.selectedItems.length > 0 ? this.selectedItems[0] : def));
    }

    private writeValue(obj: any): void {
        if (typeof obj === 'object' && obj instanceof Array) {
            this.selectedItems = obj;
            return;
        }
        this.selectedItems = [typeof this.rangeKey() === 'number' && !obj ? 0 : obj];
    }
}
