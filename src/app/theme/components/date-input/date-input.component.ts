import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatDate } from '../../utils';

@Component({
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

    @Input() public placeholder = '请选择日期';
    @Input() public format = 'yyyy-mm-dd';
    @Input() min: Date = new Date('2000/01/01 00:00:00');
    @Input() max: Date = new Date('2030/12/31 23:59:59');
    @Input() minYear = 2000;
    @Input() maxYear = 2066;
    public value = '';
    public disabled = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor() { }

    public onDateChange(event: string) {
        this.value = event;
        this.output();
    }

    public onValueChange(event: InputEvent) {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.output();
    }

    private output() {
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj && /^\d{10}$/.test(obj) ? formatDate(obj, this.format) : obj;
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
