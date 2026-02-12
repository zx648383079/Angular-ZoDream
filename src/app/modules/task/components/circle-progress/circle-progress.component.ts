import { AfterViewInit, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { formatHour } from '../../../../theme/utils';
import { interval, Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-circle-progress',
    templateUrl: './circle-progress.component.html',
    styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements AfterViewInit {

    private readonly drawerElement = viewChild<ElementRef>('drawerBox');

    public readonly outline = input('rgba(38,129,215,0.3)');
    public readonly inline = input('#51eb3e');
    public readonly inlineBackground = input('rgba(255,255,255,0.3)');
    public readonly lineWidth = input(3);
    public readonly finished = output<CircleProgressComponent>();
    public readonly valueChange = output<number>();

    public readonly label = signal('');
    private value = 0;
    private max = 0;

    private ctx: CanvasRenderingContext2D;
    private $timer: Subscription;
    private startTime = 0;

    get drawer(): HTMLCanvasElement {
        return this.drawerElement().nativeElement as HTMLCanvasElement;
    }

    ngAfterViewInit() {
        this.drawer.width = 200;
        this.drawer.height = 200;
        this.ctx = this.drawer.getContext('2d');
        this.drawProgress(this.ctx, 0);
    }

    public start(value = 0, max = 0) {
        this.value = value;
        this.max = max;
        this.startTime = Date.now() - this.value * 1000;
        if (this.$timer) {
            return;
        }
        this.$timer = interval(100).subscribe(() => {
            const diff = Math.ceil((Date.now() - this.startTime) / 1000);
            if (this.max > 0 && diff > this.max) {
                this.computed();
                this.stop();
                return;
            }
            this.valueChange.emit(this.value = diff);
            this.computed();
        });
    }

    public stop() {
        if (!this.$timer) {
            return;
        }
        this.$timer.unsubscribe();
        this.$timer = null;
        this.finished.emit(this);
    }

    private computed(value = this.value, max = this.max) {
        if (max > 0) {
            this.label.set(formatHour(Math.max(max - value, 0), undefined, true));
            this.drawProgress(this.ctx, 100 - value * 100 / max);
            return;
        }
        max = Math.ceil(Math.max(value, 1) / 3600) * 3600;
        this.label.set(formatHour(value, undefined, true));
        this.drawProgress(this.ctx, value * 100 / max);
    }

    private drawProgress(ctx: CanvasRenderingContext2D, progress: number, centerX = 100, centerY = 100, radius = 100) {
        if (!ctx) {
            return;
        }
        // 线圈的内半径
        const lineRadius = radius - this.lineWidth();
        // 内圈的半径
        const inlineRadius = lineRadius - 5;
        ctx.clearRect(centerX - radius, centerY - radius, 2 * radius, 2 * radius);
        ctx.beginPath();
        ctx.arc(centerX, centerY, inlineRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.inlineBackground();
        ctx.fill();
        ctx.lineWidth = this.lineWidth();	// 圆环的粗细
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.arc(centerX, centerY, lineRadius, 0, Math.PI * 2, false);
        ctx.strokeStyle = this.outline();
        ctx.stroke();
        const deg = (2 * Math.PI / 100 * progress)
                    - 0.5 * Math.PI; // 圆环的绘制
        ctx.beginPath();
        ctx.arc(centerX, centerY, lineRadius, - 0.5 * Math.PI, deg, false);
        ctx.strokeStyle = this.inline();
        ctx.stroke();
        const x = centerX + Math.cos(Math.PI * 2 * (progress - 25) / 100) * lineRadius;
        const y = centerY + Math.sin(Math.PI * 2  * (progress - 25) / 100) * lineRadius;
        ctx.beginPath();
        ctx.arc(x, y, this.lineWidth(), 0, Math.PI * 2, false);
        ctx.fillStyle = this.inline();
        ctx.fill();
    }

}
