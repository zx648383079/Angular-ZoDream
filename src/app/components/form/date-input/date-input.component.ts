import { Component, input, model } from '@angular/core';
import { formatDate } from '../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements FormValueControl<string> {

    public readonly placeholder = input($localize `Please select a date`);
    public readonly format = input('yyyy-mm-dd');
    readonly minimum = input<Date>(new Date('2000/01/01 00:00:00'));
    readonly maximum = input<Date>(new Date('2090/12/31 23:59:59'));
    readonly minYear = input(2000);
    readonly maxYear = input(2066);
    public readonly value = model('');
    public readonly disabled = input(false);


    public onValueChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value);
    }

    private writeValue(obj: any): void {
        this.value.set(obj && /^\d{10}$/.test(obj) ? formatDate(obj, this.format()) : (obj ? obj : ''));
    }

}
