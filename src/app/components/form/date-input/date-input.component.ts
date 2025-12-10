import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatDate } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DateInputComponent),
        multi: true
    }]
})
export class DateInputComponent {

    public readonly placeholder = input($localize `Please select a date`);
    public readonly format = input('yyyy-mm-dd');
    readonly min = input<Date>(new Date('2000/01/01 00:00:00'));
    readonly max = input<Date>(new Date('2090/12/31 23:59:59'));
    readonly minYear = input(2000);
    readonly maxYear = input(2066);
    public value = '';
    public disabled = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor() { }

    public onDateChange(event: string) {
        this.value = event;
        this.output();
    }

    public onValueChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.output();
    }

    private output() {
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj && /^\d{10}$/.test(obj) ? formatDate(obj, this.format()) : (obj ? obj : '');
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
