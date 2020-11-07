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

    @Input() public outline = 'gray';
    @Input() public inline = 'red';
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
        this.drawProgress(0);
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
            this.drawProgress(100 - value * 100 / max);
            return;
        }
        max = Math.ceil(Math.max(value, 1) / 3600) * 3600;
        this.label = formatHour(value, undefined, true);
        this.drawProgress(value * 100 / max);
    }

    private drawProgress(progress: number, centerX: number = 100, centerY: number = 100) {
        const ctx = this.ctx;
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, 200, 200);
        ctx.beginPath();
        const deg = (2 * Math.PI / 100 * progress)
                    - 0.5 * Math.PI; // 圆环的绘制
        const radius = centerX - 8;
        ctx.lineWidth = 16;	// 圆环的粗细
        ctx.lineCap = 'butt';	// 圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
        ctx.strokeStyle = this.outline; // 圆环线条的颜色
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = this.inline;
        ctx.arc(centerX, centerY, radius, - 0.5 * Math.PI, deg); // 绘制的动作
        ctx.stroke();
    }

}
