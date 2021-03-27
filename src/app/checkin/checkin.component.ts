import { Component, ElementRef, HostListener } from '@angular/core';
import { hasElementByClass, twoPad } from '../theme/utils';
import { CheckinService } from './checkin.service';
import { ICheckIn } from './model';

interface IDay {
    val: string,
    day?: number,
    disable?: boolean,
    active?: boolean,
}

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent {

    public panelVisible = false;
    public dayItems: IDay[] = [];
    public data: ICheckIn;
    public month = '';
    public canNext = false;
    private booted = false;
    private monthDate: Date;

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.checkin-picker') && !hasElementByClass(event.path, 'checkin-picker_container')) {
            this.panelVisible = false;
        }
    }

    constructor(
        private service: CheckinService,
        private elementRef: ElementRef<HTMLDivElement>
    ) { }

    get panelStyle() {
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        const diff = window.innerWidth - bound.left - 300;
        // const top = bound.top;
        return {
            'margin-left': (diff >= 0 ? 0 : diff) + 'px',
            // 'margin-top': (top >= 0 ? 0 : -310) + 'px',
        };
    }

    private load() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.setMonth(new Date());
        this.service.canCheck().subscribe(res => {
            this.data = res.data;
        });
        
    }

    public tapButton() {
        this.load();
        this.panelVisible = true;
    }

    private setMonth(date: Date) {
        date.setDate(1);
        const now = new Date();
        this.monthDate = date;
        this.month = now.getFullYear() === date.getFullYear() ? (date.getMonth() + 1).toString() : [date.getFullYear(), '年', twoPad(date.getMonth() + 1)].join('');
        now.setDate(1);
        now.setHours(0, 0, 0);
        this.canNext = date.getTime() < now.getTime();
        this.refreshGrid(date);
        this.refreshLog(date);
    }

    private refreshLog(date: Date) {
        this.service.monthLog([date.getFullYear(), date.getMonth() + 1].join('-')).subscribe(res => {
            this.checkDay(...res.data.map(i => {
                return new Date(i.created_at).getDate();
            }));
        });
    }

    private refreshGrid(current: Date) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        const date = new Date(year, month, 0);
        const count = date.getDate();
        date.setDate(1);
        const start = date.getDay();
        let dayItems = [];
        for (let i = 0; i < count + start; i++) {
            dayItems.push(i < start ? {
                val: '',
            } : {
                val: twoPad(i - start + 1),
                day: i - start + 1,
            });
        }
        this.dayItems = dayItems;
    }

    private checkDay(...days: number[]) {
        let len = days.length;
        if (len < 1) {
            return;
        }
        for (const item of this.dayItems) {
            if (item.day && days.indexOf(item.day) >= 0) {
                item.active = true;
                len --;
            }
            if (len < 1) {
                break;
            }
        }
    }

    public tapCheck() {
        this.service.checkIn().subscribe(res => {
            if (res.data) {
                this.data = res.data;
                this.checkDay(new Date(res.data.created_at).getDate());
            }
        });
    }

    public tapPrevious() {
        const date = this.monthDate;
        date.setMonth(date.getMonth() - 1)
        this.setMonth(date);
    }

    public tapNext() {
        const date = this.monthDate;
        date.setMonth(date.getMonth() + 1)
        this.setMonth(date);
    }

}
