import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { formatHour } from '../../utils';

@Component({
    selector: 'app-circle-progress',
    templateUrl: './circle-progress.component.html',
    styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements AfterViewInit {

    @ViewChild('drawerBox')
    private drawerElement: ElementRef;

    @Input() public outline = 'rgba(38,129,215,0.3)';
    @Input() public inline = '#51eb3e';
    @Input() public inlineBackground = 'rgba(255,255,255,0.3)';
    @Input() public lineWidth = 3;
    @Output() public finished: EventEmitter<CircleProgressComponent> = new EventEmitter();
    @Output() public valueChange: EventEmitter<number> = new EventEmitter();

    public label = '';
    private value = 0;
    private max = 0;

    private ctx: CanvasRenderingContext2D;
    private timer = 0;
    private startTime = 0;

    constructor() { }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement.nativeElement as HTMLCanvasElement;
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes.value) {
    //         this.computed();
    //     }
    //     if (changes.max) {
    //         this.computed();
    //     }
    // }

    ngAfterViewInit() {
        this.drawer.width = 200;
        this.drawer.height = 200;
        this.ctx = this.drawer.getContext('2d');
        this.drawProgress(this.ctx, 0);
    }

    public start(value = 0, max = 0) {
        this.value = value;
        this.max = max;
        this.startTime = new Date().getTime() - this.value * 1000;
        if (this.timer > 0) {
            return;
        }
        this.timer = window.setInterval(() => {
            const diff = Math.ceil((new Date().getTime() - this.startTime) / 1000);
            if (this.max > 0 && diff > this.max) {
                this.stop();
                return;
            }
            this.valueChange.emit(this.value = diff);
            this.computed();
        }, 100);
    }

    public stop() {
        if (this.timer < 1) {
            return;
        }
        clearInterval(this.timer);
        this.timer = 0;
        this.finished.emit(this);
    }

    private computed(value = this.value, max = this.max) {
        if (max > 0) {
            this.label = formatHour(Math.max(max - value, 0), undefined, true);
            this.drawProgress(this.ctx, 100 - value * 100 / max);
            return;
        }
        max = Math.ceil(Math.max(value, 1) / 3600) * 3600;
        this.label = formatHour(value, undefined, true);
        this.drawProgress(this.ctx, value * 100 / max);
    }

    private drawProgress(ctx: CanvasRenderingContext2D, progress: number, centerX = 100, centerY = 100, radius = 100) {
        if (!ctx) {
            return;
        }
        // 线圈的内半径
        const lineRadius = radius - this.lineWidth;
        // 内圈的半径
        const inlineRadius = lineRadius - 5;
        ctx.clearRect(centerX - radius, centerY - radius, 2 * radius, 2 * radius);
        ctx.beginPath();
        ctx.arc(centerX, centerY, inlineRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.inlineBackground;
        ctx.fill();
        ctx.lineWidth = this.lineWidth;	// 圆环的粗细
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.arc(centerX, centerY, lineRadius, 0, Math.PI * 2, false);
        ctx.strokeStyle = this.outline;
        ctx.stroke();
        const deg = (2 * Math.PI / 100 * progress)
                    - 0.5 * Math.PI; // 圆环的绘制
        ctx.beginPath();
        ctx.arc(centerX, centerY, lineRadius, - 0.5 * Math.PI, deg, false);
        ctx.strokeStyle = this.inline;
        ctx.stroke();
        const x = centerX + Math.cos(Math.PI * 2 * (progress - 25) / 100) * lineRadius;
        const y = centerY + Math.sin(Math.PI * 2  * (progress - 25) / 100) * lineRadius;
        ctx.beginPath();
        ctx.arc(x, y, this.lineWidth, 0, Math.PI * 2, false);
        ctx.fillStyle = this.inline;
        ctx.fill();
    }

}
