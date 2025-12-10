import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
    standalone: false,
  selector: 'app-gua',
  templateUrl: './gua.component.html',
  styleUrls: ['./gua.component.scss']
})
export class GuaComponent implements AfterViewInit {

    private readonly drawerElement = viewChild<ElementRef<HTMLCanvasElement>>('drawerBox');
    public readonly placeholder = input('刮开有奖');
    public readonly value = input('未中奖');
    public readonly foreground = input('grey');
    public readonly background = input('white');
    public readonly loading = output();

    private ctx: CanvasRenderingContext2D;
    private disabled = true;
    private isLoaded = false;

    constructor() { }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement().nativeElement as HTMLCanvasElement;
    }

    ngAfterViewInit() {
        this.drawer.width = 300;
        this.drawer.height = 180;
        this.ctx = this.drawer.getContext('2d');
        this.reset();
    }

    public tapStart() {
        this.disabled = false;
    }

    public tapEnd() {
        this.disabled = true;
    }

    public onMove(event: MouseEvent) {
        if (this.disabled) {
            return;
        }
        if (this.isLoaded) {
            this.isLoaded = true;
            this.loading.emit();
        }
        const bound = this.drawer.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x - bound.left, y - bound.top, 30, 0, Math.PI * 2);
        this.ctx.fill();
    }

    public reset() {
        this.isLoaded = false;
        this.disabled = true;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.foreground();
        this.ctx.fillRect(0, 0, 300, 180);
        this.ctx.fillStyle = this.background();
        this.ctx.font = '30px Microsoft YaHei';
        this.ctx.fillText('刮开有奖', 90, 100);
    }
}
