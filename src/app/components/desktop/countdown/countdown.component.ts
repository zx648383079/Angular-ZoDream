import { Component, OnDestroy, effect, input, output } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnDestroy {

    public readonly label = input('');
    public readonly end = input<any>(undefined);
    public readonly auto = input(false);
    public readonly finished = output();

    public hour = 0;
    public minute = 0;
    public second = 0;
    private formatEnd = 0;
    private timerHandle = 0;

    constructor() {
        effect(() => {
            this.formatEnd = this.parseTime(this.end());
            if (this.auto()) {
                this.startTimer();
            }
        });
        effect(() => {
            this.auto() ? this.startTimer() : this.stopTimer();
        });
    }

    ngOnDestroy() {
        if (this.auto()) {
            this.stopTimer();
        }
    }

    public refresh(now?: Date) {
        if (!now) {
            now = new Date();
        }
        const diff = Math.max(this.formatEnd - this.parseTime(now), 0) / 1000;
        if (diff <= 0) {
            this.finished.emit();
        }
        this.hour = Math.floor(diff / 3600);
        this.minute = Math.floor(diff % 3600 / 60);
        this.second = Math.floor(diff % 60);
        if (diff <= 0) {
            this.stopTimer();
        }
    }

    private startTimer() {
        this.stopTimer();
        this.timerHandle = window.setInterval(() => {
            this.refresh();
        }, 300);
    }

    private stopTimer() {
        if (this.timerHandle > 0) {
            clearInterval(this.timerHandle);
            this.timerHandle = 0;
        }
    }

    private parseTime(date: any): number {
        if (!date) {
            return 0;
        }
        if (typeof date === 'object') {
            return (date as Date).getTime();
        }
        if (typeof date === 'string' && !/^\d{10}$/.test(date)) {
            return new Date(date).getTime();
        }
        return /^\d{10}$/.test(date) ? date * 1000 : parseInt(date, 10);
    }
}
