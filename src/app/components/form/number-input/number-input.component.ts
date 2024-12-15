import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    standalone: false,
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

    @Input() public min = 0;
    @Input() public max = 0;
    @Input() public step = 1;
    @Input() public disabled = false;
    /**
     * 是否仅允许数字
     */
    @Input() public only = true;
    public value: string|number = 1;

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor() {}

    public get minDisabled() {
        if (this.disabled) {
            return true;
        }
        return this.valueInt <= this.min;
    }

    public get maxDisabled() {
        if (this.disabled) {
            return true;
        }
        return this.max > 0 && this.valueInt >= this.max;
    }

    public get valueInt(): number {
        return this.parseInt(this.value);
    }

    public tapMinus() {
        if (this.minDisabled) {
            return;
        }
        this.tapChange(this.valueInt - Math.max(typeof this.step === 'string' ? parseFloat(this.step) : this.step, 1));
    }

    public tapPlus() {
        if (this.maxDisabled) {
            return;
        }
        this.tapChange(this.valueInt + Math.max(typeof this.step === 'string' ? parseFloat(this.step) : this.step, 1));
    }

    public onValueChange(e: Event) {
        const v = (e.target as HTMLInputElement).value;
        this.tapChange(this.parseInt(v), v);
    }

    public tapChange(i: number, format?: string) {
        if (this.disabled) {
            return;
        }
        if (i < this.min) {
            i = typeof this.min === 'string' ? parseFloat(this.min) : this.min;
        } else if (this.max > 0 && i > this.max) {
            i = typeof this.max === 'string' ? parseFloat(this.max) : this.max;
        }
        this.onChange(this.value = this.renderInt(i, format));
    }

    private parseInt(value: number|string) {
        if (!value) {
            return 0;
        }
        if (typeof value === 'number') {
            return value;
        }
        if (this.only) {
            const v = parseFloat(value)
            return isNaN(v) ? 0 : v;
        }
        const match = value.match(/[\d.]+/);
        if (!match) {
            return 0;
        }
        const v = parseFloat(match[0]);
        return isNaN(v) ? 0 : v;
    }

    private renderInt(value: number, format = this.value): number|string {
        if (this.only || !format || typeof format === 'number') {
            return value;
        }
        const match = format.match(/[\d.]+/);
        if (!match) {
            return value + format;
        }
        return format.substring(0, match.index) + value + format.substring(match.index + match[0].length);
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
