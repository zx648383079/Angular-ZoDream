import { Component, HostListener,  effect, input, model } from '@angular/core';
import { rangeStep, twoPad } from '../../../theme/utils';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss'],
})
export class TimeInputComponent implements FormValueControl<string> {

    public readonly minimum = input('00:00');
    public readonly maximum = input('23:59');
    public readonly placeholder = input($localize `Please select...`);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public hourItems: number[] = [];
    public minuteItems: number[] = [];
    public panelVisible = false;

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.time-input-container') && !hasElementByClass(event.path, 'time-input-container')) {
            this.panelVisible = false;
        }
    }

    constructor() {
        this.minuteItems = rangeStep(0, 59);
        this.hourItems = rangeStep(0, 23);
        effect(() => {
            this.minimum();
            this.maximum();
            this.refreshHours();
        });
    }

    get currentHour() {
        return this.timeInt(this.value());
    }

    get currentMinute() {
        return this.timeInt(this.value(), 1);
    }

    public twoPad(val: number) {
        if (val < 10) {
            return '0' + val;
        }
        return val;
    }

    public onValueChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(this.timeParse(value).map(twoPad).join(':'));
    }

    public onFocus() {
        this.panelVisible = true;
    }

    public tapHour(i: number) {
        this.value.set([i, this.currentMinute].map(twoPad).join(':'));
        this.refreshMinutes();
    }

    public tapMinute(i: number) {
        this.value.set([this.currentHour, i].map(twoPad).join(':'));
        this.panelVisible = false;
    }

    private refreshHours() {
        this.hourItems = rangeStep(this.timeInt(this.minimum()), this.timeInt(this.maximum(), 0, 23));
    }

    private refreshMinutes() {
        const hour = this.currentHour;
        const min = this.timeParse(this.minimum());
        const max = this.timeParse(this.maximum());
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

}
