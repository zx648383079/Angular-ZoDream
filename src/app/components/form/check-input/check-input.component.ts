import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-check-input',
    templateUrl: './check-input.component.html',
    styleUrls: ['./check-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckInputComponent),
        multi: true
    }]
})
export class CheckInputComponent implements ControlValueAccessor {

    @Input() public items: any[] = [];
    @Input() public multiple = false;
    /**
     * 值的键名，数字表示为数组的排序，空为项，其他为项的值
     */
    @Input() public rangeKey: any = '';
    @Input() public rangeLabel = '';

    private selectedItems: any[] = [];
    public disabled = false;
    private onChange: any = () => {};
    private onTouch: any = () => {};

    constructor() { }

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
        if (!this.multiple) {
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
        if (typeof this.rangeKey === 'number') {
            return index;
        }
        if (this.rangeKey) {
            return item[this.rangeKey];
        }
        return item;
    }

    private output() {
        const def = typeof this.rangeKey === 'number' ? -1 : null;
        this.onChange(this.multiple ? [...this.selectedItems] : (this.selectedItems.length > 0 ? this.selectedItems[0] : def));
    }

    writeValue(obj: any): void {
        if (typeof obj === 'object' && obj instanceof Array) {
            this.selectedItems = obj;
            return;
        }
        this.selectedItems = [typeof this.rangeKey === 'number' && !obj ? 0 : obj];
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
