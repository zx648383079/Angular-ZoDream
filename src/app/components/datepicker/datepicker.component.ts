import { Component, OnInit, HostListener, ElementRef, inject, input, model, effect, signal, untracked, computed } from '@angular/core';
import { formatDate, twoPad } from '../../theme/utils';
import { IDay, DayMode } from './datepicker.base';
import { hasElementByClass } from '../../theme/utils/doc';

@Component({
    standalone: false,
    selector: 'app-datepicker',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

    public readonly minimum = input(new Date('1900/01/01 00:00:00'), {transform: this.transformMin.bind(this)});
    public readonly maximum = input(new Date('2099/12/31 23:59:59'), {transform: this.transformMax.bind(this)});
    public readonly minYear = input(1900);
    public readonly maxYear = input(2099);
    public readonly titleFormat = input($localize `y-mm-dd`);
    public readonly format = input('y-mm-dd hh:ii:ss');
    public readonly value = model<string | Date>(undefined);
    private currentDate: Date = new Date();

    public readonly title = signal('-');

    public readonly dayItems = signal<IDay[]>([]);

    public readonly yearItems = signal<number[]>([]);

    public readonly monthItems = signal<number[]>([]);

    public readonly hourItems = signal<number[]>([]);

    public readonly minuteItems = signal<number[]>([]);

    public readonly secondItems = signal<number[]>([]);

    public readonly currentYear = signal(0);

    public readonly currentMonth = signal(0);

    public readonly currentDay = signal(0);

    public readonly currentHour = signal(0);

    public readonly currentMinute = signal(0);

    public readonly currentSecond = signal(0);

    public readonly hasTime = signal(true);

    public readonly visible = signal(false);

    public readonly gridMode = signal(DayMode.Day);

    constructor() {
        effect(() => {
            const format = this.format();
            untracked(() => {
                this.hasTime.set(format.indexOf('h') >= 0);
            });
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
            this.visible.set(false);
        }
    }

    public readonly calendarStyle = computed(() => {
        if (window.innerWidth < 576) {
            return;
        }
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        const diff = window.innerWidth - bound.left - 310;
        const x = diff > 0 ? 0 : diff;
        const y = bound.top + 350 > window.innerHeight ? -350 : 0;
        return {
            'margin-left': x + 'px',
            'margin-top': y + 'px',
        };
    });

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
        return twoPad(val);
    }

    /**
     * 转化date
     */
    private parseDate(date: any): Date {
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
    private checkDate(date: Date): boolean {
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
    private refresh() {
        this.hasTime.set(this.format().indexOf('h') >= 0);
        this.refreshCurrent();
        this.initDays();
    }

    private refreshCurrent() {
        this.currentYear.set(this.currentDate.getFullYear());
        this.currentMonth.set(this.currentDate.getMonth() + 1);
        this.currentDay.set(this.currentDate.getDate());
        if (this.hasTime) {
            this.currentHour.set(this.currentDate.getHours());
            this.currentMinute.set(this.currentDate.getMinutes());
            this.currentSecond.set(this.currentDate.getSeconds());
        }
        this.title.set(formatDate(this.currentDate, this.titleFormat()));
    }

    private initHours() {
        const items = [];
        for (let i = 0; i < 24; i++) {
            items.push(i);
        }
        this.hourItems.set(items);
    }

    private initMinutes() {
        const items = [];
        for (let i = 0; i < 60; i++) {
            items.push(i);
        }
        this.minuteItems.set(items);
    }

    private initSeconds() {
        const items = [];
        for (let i = 0; i < 60; i++) {
            items.push(i);
        }
        this.secondItems.set(items);
    }

    private initMonths() {
        const items = [];
        for (let i = 1; i < 13; i++) {
            items.push(i);
        }
        this.monthItems.set(items);
    }

    private initYears() {
        const items = [];
        for (let i = this.minYear(); i <= this.maxYear(); i++) {
            items.push(i);
        }
        this.yearItems.set(items);
    }

    private initDays() {
        this.dayItems.set(this.getDaysOfMonth(this.currentMonth(), this.currentYear()));
    }

    public toggleYear() {
        this.gridMode.update(v => {
            return v === DayMode.Year ? DayMode.Day : DayMode.Year;
        });
    }

    public toggleTime(e?: Event) {
        e?.stopPropagation();
        this.gridMode.update(v => {
            return v === DayMode.Hour ? DayMode.Day : DayMode.Hour;
        });
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
    public previousYear() {
        this.changeYear(this.currentYear() - 1);
    }
    /**
     * 下一年
     */
    public nextYear() {
        this.changeYear(this.currentYear() + 1);
    }
    /**
     * 上月
     */
    public previousMonth() {
        this.changeMonth(this.currentMonth() - 1);
    }
    /**
     * 下月
     */
    public nextMonth() {
        this.changeMonth(this.currentMonth() + 1);
    }

    private applyCurrent() {
        this.currentDate.setFullYear(this.currentYear(), this.currentMonth() - 1, this.currentDay());
        if (this.hasTime) {
            this.currentDate.setHours(this.currentHour(), this.currentMinute(), this.currentSecond());
        }
        this.title.set(formatDate(this.currentDate, this.titleFormat()));
    }

    public changeYear(year: number) {
        this.currentYear.set(year);
        this.initDays();
        this.applyCurrent();
    }

    public changeMonth(month: number) {
        this.currentMonth.set(month);
        this.initDays();
        this.applyCurrent();
    }

    public changeDay(day: IDay) {
        const date = new Date(this.currentDate.getTime());
        if (day.disabled) {
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
            this.close(true);
            return;
        }
    }

    public changeHour(hour: number) {
        this.currentHour.set(hour);
    }

    public changeMinute(minute: number) {
        this.currentMinute.set(minute);
    }

    public changeSecond(second: number) {
        this.currentSecond.set(second);
    }

    /**
     * 确认改变
     */
    public close(isOk = false) {
        if (!isOk) {
            this.visible.set(false);
            return;
        }
        this.applyCurrent();
        if (!this.checkDate(this.currentDate)) {
            return;
        }
        this.output();
        this.visible.set(false);
    }

    private output() {
        this.value.set(formatDate(this.currentDate, this.format()));
    }

    public open() {
        this.visible.set(true);
        this.refresh();
    }
}
