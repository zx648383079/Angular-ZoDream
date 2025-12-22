import { Subject } from 'rxjs';

export interface IAnimationTimer {
    tick(timestamp: number): void;
}

export class AnimationFx {
    private static timerItems: IAnimationTimer[] = [];
    private static isProgress = false;

    public static schedule(timestamp?: number) {
        if (!this.isProgress) {
            return;
        }
        if (document.hidden === false && window.requestAnimationFrame) {
			window.requestAnimationFrame(this.schedule.bind(this));
		} else {
			window.setTimeout(this.schedule.bind(this), 13);
		}
        if (typeof timestamp !== 'number') {
            timestamp = this.now();
        }
        this.tick(timestamp);
    }

    public static now(): number {
        return window.performance.now();
    }

    private static tick(timestamp: number) {
        for (let i = this.timerItems.length - 1; i >= 0; i--) {
            this.timerItems[i].tick(timestamp)
        }
    }

    public static push(timer: IAnimationTimer) {
        if (this.timerItems.indexOf(timer) >= 0) {
            return;
        }
        this.timerItems.push(timer);
        if (!this.isProgress) {
            this.isProgress = true;
            this.schedule();
        }
    }

    public static remove(timer: IAnimationTimer) {
        for (let i = this.timerItems.length - 1; i >= 0; i--) {
            if (this.timerItems[i] === timer) {
                this.timerItems.splice(i, 1);
            }
        }
        if (this.isProgress && this.timerItems.length === 0) {
            this.isProgress = false;
        }
    }
}

export class AnimationTween implements IAnimationTimer {
    constructor(
        public timeout = 3000,
    ) {
    }

    private paused = true;
    private lastTime = 0;
    public readonly finish$ = new Subject<void>();

    public next() {
        this.lastTime = AnimationFx.now();
        this.paused = false;
        AnimationFx.push(this);
    }

    public stop() {
        this.paused = true;
    }

    public close() {
        this.stop();
        this.finish$.unsubscribe();
        AnimationFx.remove(this);
    }

    public tick(timestamp: number): void {
        if (this.paused) {
            return;
        }
        const elapsed = timestamp - this.lastTime;
        if (elapsed < this.timeout) {
            return;
        }
        this.paused = true;
        this.finish$.next();
    }

}