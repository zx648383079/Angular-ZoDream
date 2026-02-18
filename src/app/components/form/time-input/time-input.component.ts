import { Component, HostListener,  computed,  effect, input, model, signal } from '@angular/core';
import { checkLoopRange, checkRange, rangeStep, twoPad } from '../../../theme/utils';
import { hasElementByClass } from '../../../theme/utils/doc';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss'],
    host: {
        class: 'select-input-container',
        '[class.--with-open]': 'panelVisible()'
    }
})
export class TimeInputComponent implements FormValueControl<string> {

    public readonly minimum = input('00:00');
    public readonly maximum = input('23:59');
    public readonly placeholder = input($localize `Please select...`);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public readonly hourItems = signal<number[]>([]);
    public readonly minuteItems = signal<number[]>([]);
    public readonly panelVisible = signal(false);

    constructor() {
        this.minuteItems.set(rangeStep(0, 59));
        this.hourItems.set(rangeStep(0, 23));
        effect(() => {
            this.minimum();
            this.maximum();
            this.refreshHours();
        });
    }

    public readonly currentHour = computed(() => {
        return this.timeInt(this.value());
    });

    public readonly currentMinute = computed(() => {
        return this.timeInt(this.value(), 1);
    });

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.select-input-container') && !hasElementByClass(event.path, 'select-input-container')) {
            this.panelVisible.set(false);
        }
    }

    @HostListener('wheel', ['$event'])
    public onWheel(e: WheelEvent) {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        e.preventDefault();
        const target = e.target.getBoundingClientRect();
        const index = (e.clientX - target.left - (target.width / 2)) < 0 ? 0 : 1;
        const offset = e.deltaY < 0 ? -1 : 1;
        this.value.update(v => {
            const args = this.timeParse(v);
            args[index] = index < 1 
                ? this.checkHourRange(args[index] + offset) 
                : this.checkMinuteRange(args[index] + offset);
            return args.map(twoPad).join(':');
        });
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
        this.panelVisible.set(true);
    }

    public tapHour(i: number) {
        this.value.set([i, this.currentMinute()].map(twoPad).join(':'));
        this.refreshMinutes();
    }

    public tapMinute(i: number) {
        this.value.set([this.currentHour(), i].map(twoPad).join(':'));
        this.panelVisible.set(false);
    }

    private refreshHours() {
        this.hourItems.set(rangeStep(this.timeInt(this.minimum()), this.timeInt(this.maximum(), 0, 23)));
    }

    private refreshMinutes() {
        const hour = this.currentHour();
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
        this.minuteItems.set(rangeStep(start, end));
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

    private checkHourRange(val: number) {
        const items = this.hourItems();
        return checkRange(val, items[0], items[items.length - 1]);
    }

    private checkMinuteRange(val: number) {
        const items = this.minuteItems();
        return checkLoopRange(val, items[0], items[items.length - 1]);
    }

}
