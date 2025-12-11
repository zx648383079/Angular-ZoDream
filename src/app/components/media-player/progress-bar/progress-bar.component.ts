import { Component, ElementRef, HostListener, input, model, viewChild } from '@angular/core';
import { formatHour } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-player-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

    private readonly box = viewChild<ElementRef<HTMLDivElement>>('progressBox');

    /**
     * 当前值
     */
    public readonly value = model(0);

    public readonly loaded = input(0);
    public readonly formatValue = input(true);
    /**
     * 最大值
     */
    public readonly max = input(100);
    /**
     * 最小移动值
     */
    public readonly min = input(0);
    private isMouseMove = false;

    constructor() {}

    public get titleTip() {
        if (!this.formatValue()) {
            return this.value();
        }
        return formatHour(this.value(), undefined, true) + '/' + formatHour(this.max(), undefined, true);
    }

    public get progressStyle() {
        return {
            width: this.max() < 1 ? 0 : (this.value() * 100 / this.max())  + '%'
        };
    }

    public get loadStyle() {
        return {
            width: this.max() < 1 ? 0 : (this.loaded() * 100 / this.max())  + '%'
        };
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: any) {
        if (!this.isMouseMove) {
            return;
        }
        const div = this.box().nativeElement as HTMLDivElement;
        const bound = div.getBoundingClientRect();
        const offset = event.clientX - bound.left;
        this.tapProgress(offset * 100 / bound.width);
    }

    @HostListener('document:mouseup')
    public onMouseUp() {
        this.isMouseMove = false;
    }

    ngAfterViewInit(): void {
        const div = this.box().nativeElement as HTMLDivElement;
        div.addEventListener('click', (event) => {
            const bound = div.getBoundingClientRect();
            this.tapProgress((event.clientX - bound.left) * 100 / bound.width);
        });
        div.addEventListener('mousedown', (event) => {
            const bound = div.getBoundingClientRect();
            const offset = event.clientX - bound.left;
            const innerWidth = div.querySelector('.inner-bar').getBoundingClientRect().width;
            if (Math.abs(offset - innerWidth) < 3) {
                this.isMouseMove = true;
            }
        });

    }

    public tapProgress(i: number) {
        if (i < 0) {
            i = 0;
        } else if (i > 100) {
            i = 100;
        }
        const max = this.max();
        this.value.set(max === 100 ? i : (i * max / 100));
    }

}
