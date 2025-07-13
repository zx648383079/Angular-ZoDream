import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IItem } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-toggle-bar',
    templateUrl: './toggle-bar.component.html',
    styleUrls: ['./toggle-bar.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ToggleBarComponent),
        multi: true
    }]
})
export class ToggleBarComponent implements ControlValueAccessor {

    @Input() public items: (IItem|string)[] = [];
    public selectedIndex = 0;
    public disabled = false;
    public iconStyle: any = {};

    onChange: any = () => {};
    onTouch: any = () => {};

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
        this.onChange(this.itemValue(this.items[this.selectedIndex], this.selectedIndex));
    }

    private updateIndex(i: number) {
        this.selectedIndex = i;
        this.iconStyle = {
            left: i * 3 + 'em'
        };
    }

    writeValue(obj: any): void {
        for (let i = 0; i < this.items.length; i++) {
            if (this.itemValue(this.items[i], i) == obj) {
                this.updateIndex(i);
                break;
            }
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState ?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
