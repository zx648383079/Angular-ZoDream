import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent {

    private readonly destroyRef = inject(DestroyRef);

    public readonly label = input('');
    public readonly end = input<any>(undefined);
    public readonly auto = input(false);
    public readonly finished = output();

    public readonly hour = signal(0);
    public readonly minute = signal(0);
    public readonly second = signal(0);
    private formatEnd = 0;
    private $timer: Subscription;

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
        this.destroyRef.onDestroy(() => {
            if (this.auto()) {
                this.stopTimer();
            }
        });
    }

    public refresh(now?: Date) {
        if (!now) {
            now = new Date();
        }
        const diff = Math.max(this.formatEnd - this.parseTime(now), 0) / 1000;
        if (diff <= 0) {
            this.finished.emit();
        }
        this.hour.set(Math.floor(diff / 3600));
        this.minute.set(Math.floor(diff % 3600 / 60));
        this.second.set(Math.floor(diff % 60));
        if (diff <= 0) {
            this.stopTimer();
        }
    }

    private startTimer() {
        this.stopTimer();
        this.$timer = interval(300).subscribe(() => {
            this.refresh();
        });
    }

    private stopTimer() {
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
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
