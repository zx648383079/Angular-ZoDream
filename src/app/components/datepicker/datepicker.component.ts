import { Component, OnInit, OnChanges, Input, EventEmitter, Output, HostListener, SimpleChanges, ElementRef } from '@angular/core';
import { formatDate } from '../../theme/utils';
import { IDay, DayMode } from './datepicker.base';
import { hasElementByClass } from '../../theme/utils/doc';

@Component({
    selector: 'app-datepicker',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit, OnChanges {
    @Input() min: Date = new Date('1900/01/01 00:00:00');
    @Input() max: Date = new Date('2099/12/31 23:59:59');
    @Input() minYear = 1900;
    @Input() maxYear = 2099;
    @Input() titleFormat = $localize `y-mm-dd`;
    @Input() format = 'y-mm-dd hh:ii:ss';
    @Input() public value: string|Date;
    private currentDate: Date = new Date();

    @Output() valueChange: EventEmitter<string> = new EventEmitter();

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

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.datepicker') && !hasElementByClass(event.path, 'datepicker__calendar')) {
            this.calendarVisible = false;
        }
    }

    constructor(
        private elementRef: ElementRef<HTMLDivElement>
    ) {
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.format) {
            this.hasTime = changes.format.currentValue.indexOf('h') > 0;
        }
        if (changes.value) {
            this.currentDate = this.parseDate(changes.value.currentValue);
        }
        if (changes.min) {
            this.min = this.parseDate(changes.min.currentValue);
            if (!this.hasTime) {
                this.min.setHours(23, 59, 59, 999);
            } else {
                this.min.setMilliseconds(999);
            }
            if (this.min >= this.currentDate) {
                // 加一天
                this.currentDate = new Date(this.min.getTime() + 86400000);
            }
        }
        if (changes.max) {
            this.max = this.parseDate(changes.max.currentValue);
            if (!this.hasTime) {
                this.max.setHours(0, 0, 0, 0);
            }
        }
        this.refresh();
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
        const min = this.min;
        if (min && date <= min) {
            return false;
        }
        const max = this.max;
        return !max || date < max;
    }

    /**
     * 刷新变化部分
     */
    refresh() {
        this.hasTime = this.format.indexOf('h') > 0;
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
        this.title = formatDate(this.currentDate, this.titleFormat);
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
        for (let i = this.minYear; i <= this.maxYear; i++) {
            this.yearItems.push(i);
        }
    }

    initDays() {
        this.dayItems = this.getDaysOfMonth(this.currentMonth, this.currentYear);
    }

    toggleYear() {
        this.gridMode = this.gridMode === DayMode.Year ? DayMode.Day : DayMode.Year;
    }

    toggleTime() {
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
        this.title = formatDate(this.currentDate, this.titleFormat);
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
        this.valueChange.emit(formatDate(this.currentDate, this.format));
    }

    showCalendar() {
        this.calendarVisible = true;
        this.refresh();
    }
}
