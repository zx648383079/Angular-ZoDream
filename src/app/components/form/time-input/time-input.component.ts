import { Component, forwardRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { rangeStep, twoPad } from '../../../theme/utils';
import { hasElementByClass } from '../../../theme/utils/doc';

@Component({
    selector: 'app-time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TimeInputComponent),
        multi: true
    }]
})
export class TimeInputComponent implements ControlValueAccessor, OnChanges {

    @Input() public min = '00:00';
    @Input() public max = '23:59';
    @Input() public placeholder = $localize `Please select...`;
    public value: string = '';
    public disabled = false;
    public hourItems: number[] = [];
    public minuteItems: number[] = [];
    public panelVisible = false;

    onChange: any = () => {};
    onTouch: any = () => {};

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.time-input-container') && !hasElementByClass(event.path, 'time-input-container')) {
            this.panelVisible = false;
        }
    }

    constructor() {
        this.minuteItems = rangeStep(0, 59);
        this.hourItems = rangeStep(0, 23);
    }

    get currentHour() {
        return this.timeInt(this.value);
    }

    get currentMinute() {
        return this.timeInt(this.value, 1);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.min || changes.max) {
            this.refreshHours();
        }
    }

    public onValueChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value = this.timeParse(value).map(twoPad).join(':');
        this.output();
    }

    public onFocus() {
        this.panelVisible = true;
    }

    public tapHour(i: number) {
        this.value = [i, this.currentMinute].map(twoPad).join(':');
        this.output();
        this.refreshMinutes();
    }

    public tapMinute(i: number) {
        this.value = [this.currentHour, i].map(twoPad).join(':');
        this.output();
        this.panelVisible = false;
    }

    private refreshHours() {
        this.hourItems = rangeStep(this.timeInt(this.min), this.timeInt(this.max, 0, 23));
    }

    private refreshMinutes() {
        const hour = this.currentHour;
        const min = this.timeParse(this.min);
        const max = this.timeParse(this.max);
        let start = 0;
        let end = 59;
        if (hour === min[0]) {
            start = min[1];
        }
        if (hour === max[1]) {
            end = max[1];
        }
        this.minuteItems = rangeStep(start, end);
    }

    private timeInt(val?: string, i = 0, def = 0): number {
        if (!val) {
            return def;
        }
        const items = val.split(':');
        return items.length > i ? parseInt(items[i], 10) : def;
    }

    private timeParse(val?: string): number[] {
        if (!val) {
            return [0, 0];
        }
        const items = val.split(':');
        return [parseInt(items[0], 10), items.length > 1 ? parseInt(items[1], 10) : 0];
    }

    private output() {
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj;
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
