import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { parseNumber } from '../../../theme/utils';

@Component({
    selector: 'app-data-size',
    templateUrl: './data-size.component.html',
    styleUrls: ['./data-size.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DataSizeComponent),
        multi: true
    }]
})
export class DataSizeComponent implements ControlValueAccessor {

    @Input() public placeholder = $localize `Please input`;
    @Input() public unitItems = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    @Input() public unitBase = 1024;
    private value = 0;
    public unitIndex = 0;
    public unitValue: any = 0;
    public disabled = false;

    onChange: any = () => {};
    onTouch: any = () => {};


    public onValueChange() {
        this.value = Math.pow(this.unitBase, this.unitIndex) * parseNumber(this.unitValue);
        this.onChange(this.value);
    }

    public onUnitChange() {
        this.unitValue = this.formatFloat(this.value / Math.pow(this.unitBase, this.unitIndex), 2);
    }

    private formatFloat(src: number, pos: number) {
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    }

    private formatUnit(val: number): number {
        let i = 0;
        let diff = val;
        while (diff > this.unitBase) {
            i ++;
            diff /= this.unitBase;
        }
        return i;
    } 

    writeValue(obj: any): void {
        const oldVal = this.value;
        this.value = parseNumber(obj);
        if (oldVal === 0 && this.value > 0) {
            this.unitIndex = this.formatUnit(this.value);
        }
        this.onUnitChange();
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
