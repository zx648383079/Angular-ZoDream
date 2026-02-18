import { Component, HostListener, input, model } from '@angular/core';
import { formatDate, parseDate } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
    host: {
        class: 'calendar-input'
    }
})
export class DateInputComponent implements FormValueControl<string> {

    public readonly placeholder = input($localize `Please select a date`);
    public readonly format = input('yyyy-mm-dd');
    public readonly minimum = input<Date>(new Date('2000/01/01 00:00:00'));
    public readonly maximum = input<Date>(new Date('2090/12/31 23:59:59'));
    public readonly minYear = input(2000);
    public readonly maxYear = input(2066);
    public readonly value = model('');
    public readonly disabled = input(false);


    @HostListener('wheel', ['$event'])
    public onWheel(e: WheelEvent) {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        e.preventDefault();
        const target = e.target.getBoundingClientRect();
        const index = Math.floor(e.clientX - target.left);
        console.log(index);
        
        const offset = e.deltaY < 0 ? -1 : 1;
        this.value.update(v => {
            const date = parseDate(v || new Date());
            if (index <= 47) {
                date.setFullYear(date.getFullYear() + offset);
            } else if (index <= 70) {
                date.setMonth(date.getMonth() + offset);
            } else if (index <= 93) {
                date.setDate(date.getDate() + offset);
            } else if (index <= 114) {
                date.setHours(date.getHours() + offset);
            } else if (index <= 137) {
                date.setMinutes(date.getMinutes() + offset);
            } else if (index <= 160) {
                date.setSeconds(date.getSeconds() + offset);
            }
            return formatDate(date, this.format());
        });
        
    }

    public onValueChange(event: Event|string|Date) {
        if (typeof event === 'string') {
            this.value.set(event as string);
            return;
        }
        if (event instanceof Date) {
            this.value.set(formatDate(event, this.format()));
            return;
        }
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value);
    }

    private writeValue(obj: any): void {
        this.value.set(obj && /^\d{10}$/.test(obj) ? formatDate(obj, this.format()) : (obj ? obj : ''));
    }

}
