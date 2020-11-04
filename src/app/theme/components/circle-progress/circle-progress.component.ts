import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'app-circle-progress',
    templateUrl: './circle-progress.component.html',
    styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements AfterViewInit, OnChanges {

    @ViewChild('drawerBox')
    private drawerElement: ElementRef;

    @Input() public progress = 0;

    private ctx: CanvasRenderingContext2D;

    constructor() { }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement.nativeElement as HTMLCanvasElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.progesss) {
            this.drawProgress(changes.progress.currentValue, 100, 100);
        }
    }

    ngAfterViewInit() {
        this.ctx = this.drawer.getContext('2d');
        this.drawProgress(this.progress, 100, 100);
    }

    public drawProgress(progress: number, centerX: number, centerY: number) {
        const ctx = this.ctx;
        if (!ctx) {
            return;
        }
        ctx.beginPath();
        const deg = (2 * Math.PI / 100 * progress)
                    - 0.5 * Math.PI; // 圆环的绘制
        ctx.strokeStyle = '#ff5000'; // 圆环线条的颜色
        ctx.lineWidth = 16;	// 圆环的粗细
        ctx.lineCap = 'butt';	// 圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
        ctx.arc(centerX, centerY, centerX - 8, -0.5 * Math.PI, deg); // 绘制的动作
        ctx.stroke();
    }

}
