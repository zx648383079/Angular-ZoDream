import { Subject } from 'rxjs';

export class AnimationTween {
    constructor(
        public timeout = 3000,
    ) {
    }

    private _hander = 0;
    public readonly finish$ = new Subject<void>();

    public get paused(): boolean {
        return this._hander === 0;
    }

    public next() {
        this.stop();
        const start = window.performance.now();
        const loopFn = (timestamp: number) => {
            const elapsed = timestamp - start;
            if (elapsed < this.timeout) {
                this._hander = requestAnimationFrame(loopFn);
                return;
            }
            this._hander = 0;
            this.finish$.next();
        }
        this._hander = requestAnimationFrame(loopFn);
    }

    public stop() {
        if (this._hander > 0) {
            cancelAnimationFrame(this._hander);
            this._hander = 0;
        }
    }

    public close() {
        this.stop();
        this.finish$.unsubscribe();
    }
}