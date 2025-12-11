import { Component, OnInit, HostListener, ElementRef, inject, input, model, effect } from '@angular/core';
import { formatDate } from '../../theme/utils';
import { IDay, DayMode } from './datepicker.base';
import { hasElementByClass } from '../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-datepicker',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
    private elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

    readonly minimum = input(new Date('1900/01/01 00:00:00'), {transform: this.transformMin});
    readonly maximum = input(new Date('2099/12/31 23:59:59'), {transform: this.transformMax});
    readonly minYear = input(1900);
    readonly maxYear = input(2099);
    readonly titleFormat = input($localize `y-mm-dd`);
    readonly format = input('y-mm-dd hh:ii:ss');
    public readonly value = model<string | Date>(undefined);
    private currentDate: Date = new Date();

    public title = '-';

    dayItems: IDay[] = [];

    yearItems: Array<number> = [];

    monthItems: Array<number> = [];

    hourItems: Array<number> = [];

    minuteItems: Array<number> = [];

    secondItems: Array<number> = [];

    currentYear: number;

    currentMonth: number;

    currentDay: number;

    currentHour: number;

    currentMinute: number;

    currentSecond: number;

    hasTime = true;

    calendarVisible = false;

    gridMode: DayMode = DayMode.Day;

    constructor() {
        effect(() => {
            this.hasTime = this.format().indexOf('h') > 0;
        });
        effect(() => {
            this.currentDate = this.parseDate(this.value());
            this.refresh();
        });
        effect(() => {
            if (this.minimum() >= this.currentDate) {
                // 加一天
                this.currentDate = new Date(this.minimum().getTime() + 86400000);
            }
        });
    }

    private transformMax(value: Date|string): Date|undefined {
        value = this.parseDate(value);
        if (!this.hasTime) {
            value.setHours(0, 0, 0, 0);
        }
        return value;
    }
    private transformMin(value: Date|string): Date|undefined {
        value = this.parseDate(value);
        if (!this.hasTime) {
            value.setHours(23, 59, 59, 999);
        } else {
            value.setMilliseconds(999);
        }
        return value;
    }

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.datepicker') && !hasElementByClass(event.path, 'datepicker__calendar')) {
            this.calendarVisible = false;
        }
    }

    get calendarStyle() {
        if (window.innerWidth < 400) {
            return;
        }
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        const diff = window.innerWidth - bound.left - 300;
        const x = diff > 0 ? 0 : diff;
        const y = bound.top + 350 > window.innerHeight ? -350 : 0;
        return {
            'margin-left': x + 'px',
            'margin-top': y + 'px',
        };
    }

    ngOnInit() {
        this.refresh();
        this.initMonths();
        this.initYears();
        if (this.hasTime) {
            this.initHours();
            this.initMinutes();
            this.initSeconds();
        }
        // this.output();
    }

    public twoPad(val: number) {
        if (val < 10) {
            return '0' + val;
        }
        return val;
    }

    /**
     * 转化date
     */
    parseDate(date: any): Date {
        if (!date) {
            return new Date();
        }
        if (typeof date === 'number') {
            return new Date(date * 1000);
        }
        if (typeof date === 'string') {
            return new Date(date);
        }
        return date;
    }

    /**
     * 验证Date
     */
     checkDate(date: Date): boolean {
        const min = this.minimum();
        if (min && date <= min) {
            return false;
        }
        const max = this.maximum();
        return !max || date < max;
    }

    /**
     * 刷新变化部分
     */
    refresh() {
        this.hasTime = this.format().indexOf('h') > 0;
        this.refreshCurrent();
        this.initDays();
    }

    refreshCurrent() {
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth() + 1;
        this.currentDay = this.currentDate.getDate();
        if (this.hasTime) {
            this.currentHour = this.currentDate.getHours();
            this.currentMinute = this.currentDate.getMinutes();
            this.currentSecond = this.currentDate.getSeconds();
        }
        this.title = formatDate(this.currentDate, this.titleFormat());
    }

    initHours() {
        this.hourItems = [];
        for (let i = 0; i < 24; i++) {
            this.hourItems.push(i);
        }
    }

    initMinutes() {
        this.minuteItems = [];
        for (let i = 0; i < 60; i++) {
            this.minuteItems.push(i);
        }
    }

    initSeconds() {
        this.secondItems = [];
        for (let i = 0; i < 60; i++) {
            this.secondItems.push(i);
        }
    }

    initMonths() {
        this.monthItems = [];
        for (let i = 1; i < 13; i++) {
            this.monthItems.push(i);
        }
    }

    initYears() {
        this.yearItems = [];
        for (let i = this.minYear(); i <= this.maxYear(); i++) {
            this.yearItems.push(i);
        }
    }

    initDays() {
        this.dayItems = this.getDaysOfMonth(this.currentMonth, this.currentYear);
    }

    toggleYear() {
        this.gridMode = this.gridMode === DayMode.Year ? DayMode.Day : DayMode.Year;
    }

    toggleTime(e?: Event) {
        e?.stopPropagation();
        this.gridMode = this.gridMode === DayMode.Hour ? DayMode.Day : DayMode.Hour;
    }


    private getDaysOfMonth(m: number, y: number): Array<IDay> {
        const days = [];
        const [f, c] = this.getFirtAndLastOfMonth(y, m);
        let i: number;
        if (f > 0) {
            const yc = this.getLastOfMonth(y, m - 1);
            for (i = yc - f + 1; i <= yc; i ++) {
                days.push({
                    disable: true,
                    val: i
                });
            }
        }
        for (i = 1; i <= c; i ++) {
            days.push({
                disable: false,
                val: i
            });
        }
        if (f + c < 43) {
            const l = 42 - f - c;
            for (i = 1; i <= l; i ++) {
                days.push({
                    disable: true,
                    val: i
                });
            }
        }
        return days;
    }

    /**
     * 获取月中最后一天
     */
    private getLastOfMonth(y: number, m: number): number {
        const date = new Date(y, m, 0);
        return date.getDate();
     }

    /**
     * 获取第一天和最后一天
     */
    private getFirtAndLastOfMonth(y: number, m: number): [number, number] {
        const date = new Date(y, m, 0);
        const count = date.getDate();
        date.setDate(1);
        return [this.getDayOfWeek(date), count];
    }

    private getDayOfWeek(date: Date): number {
        const day = date.getDay();
        if (day < 1) {
            return 6;
        }
        return day - 1;
    }

    /**
     * 上一年
     */
    previousYear() {
        this.changeYear(this.currentYear - 1);
    }
    /**
     * 下一年
     */
    nextYear() {
        this.changeYear(this.currentYear + 1);
    }
    /**
     * 上月
     */
    previousMonth() {
        this.changeMonth(this.currentMonth - 1);
    }
    /**
     * 下月
     */
    nextMonth() {
        this.changeMonth(this.currentMonth + 1);
    }

    applyCurrent() {
        this.currentDate.setFullYear(this.currentYear, this.currentMonth - 1, this.currentDay);
        if (this.hasTime) {
            this.currentDate.setHours(this.currentHour, this.currentMinute, this.currentSecond);
        }
        this.title = formatDate(this.currentDate, this.titleFormat());
    }

    changeYear(year: number) {
        this.currentYear = year;
        this.initDays();
        this.applyCurrent();
    }

    changeMonth(month: number) {
        this.currentMonth = month;
        this.initDays();
        this.applyCurrent();
    }

    changeDay(day: IDay) {
        const date = new Date(this.currentDate.getTime());
        if (day.disable) {
            if (day.val < 15) {
                date.setMonth(date.getMonth() + 1);
            } else {
                date.setMonth(date.getMonth() - 1);
            }
        }
        date.setDate(day.val);
        if (!this.checkDate(date)) {
            return;
        }
        this.currentDate = date;
        this.refreshCurrent();
        if (!this.hasTime) {
            this.enterChange();
            return;
        }
    }

    changeHour(hour: number) {
        this.currentHour = hour;
    }

    changeMinute(minute: number) {
        this.currentMinute = minute;
    }

    changeSecond(second: number) {
        this.currentSecond = second;
    }

    /**
     * 确认改变
     */
    enterChange() {
        this.applyCurrent();
        if (!this.checkDate(this.currentDate)) {
            return;
        }
        this.output();
        this.calendarVisible = false;
    }

    output() {
        this.value.set(formatDate(this.currentDate, this.format()));
    }

    showCalendar() {
        this.calendarVisible = true;
        this.refresh();
    }
}
