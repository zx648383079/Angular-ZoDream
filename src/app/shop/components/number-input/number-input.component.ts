import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberInputComponent),
            multi: true
        }
    ]
})
export class NumberInputComponent implements ControlValueAccessor {

    @Input() public min: number|string = 0;
    @Input() public max: number|string = 0;
    @Input() public step: number|string = 1;
    @Input() public disabled = false;
    public value = 1;

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() {}

    public get minDisabled() {
        if (this.disabled) {
            return true;
        }
        return this.value <= this.min;
    }

    public get maxDisabled() {
        if (this.disabled) {
            return true;
        }
        return this.max > 0 && this.value >= this.max;
    }

    public tapMinus() {
        if (this.minDisabled) {
            return;
        }
        this.tapChange(this.value - Math.max(typeof this.step === 'string' ? parseFloat(this.step) : this.step, 1));
    }

    public tapPlus() {
        if (this.maxDisabled) {
            return;
        }
        this.tapChange(this.value + Math.max(typeof this.step === 'string' ? parseFloat(this.step) : this.step, 1));
    }

    public onValueChange(e: Event) {
        this.tapChange(parseFloat((e.target as HTMLInputElement).value));
    }

    public tapChange(i: number) {
        if (this.disabled) {
            return;
        }
        if (i < this.min) {
            i = typeof this.min === 'string' ? parseFloat(this.min) : this.min;
        } else if (this.max > 0 && i > this.max) {
            i = typeof this.max === 'string' ? parseFloat(this.max) : this.max;
        }
        this.onChange(this.value = i);
    }

    writeValue(obj: any): void {
        this.value = typeof obj === 'string' ? parseFloat(obj) : obj;
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
