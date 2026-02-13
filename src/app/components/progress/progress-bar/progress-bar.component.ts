import {
  Component,
  ElementRef,
  HostListener,
  input,
  model,
  inject,
  computed
} from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
    host: {
        '[class]': "theme()",
        '[title]': "value().toFixed(2)",
    }
})
export class ProgressBarComponent {

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * 当前值
     */
    public readonly value = model(0);
    /**
     * 最大值
     */
    public readonly max = input(100);
    /**
     * 最小移动值
     */
    public readonly min = input(0);
    public readonly label = input(true);
    public readonly theme = input('progress'); // .progress-primary
    private isMouseMove = false;

    public readonly progressStyle = computed(() => {
        return {
            width: this.max() < 1 ? 0 : (this.value() * 100 / this.max())  + '%'
        };
    });

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: any) {
        if (!this.isMouseMove) {
            return;
        }
        const div = this.elementRef.nativeElement as HTMLDivElement;
        const bound = div.getBoundingClientRect();
        const offset = event.clientX - bound.left;
        this.tapProgress(offset * 100 / bound.width);
    }

    @HostListener('document:mouseup')
    public onMouseUp() {
        this.isMouseMove = false;
    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        const div = this.elementRef.nativeElement as HTMLDivElement;
        const bound = div.getBoundingClientRect();
        this.tapProgress((event.clientX - bound.left) * 100 / bound.width);
    }
    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent) {
        const div = this.elementRef.nativeElement as HTMLDivElement;
        const bound = div.getBoundingClientRect();
        const offset = event.clientX - bound.left;
        const innerWidth = div.querySelector('.progress-bar').getBoundingClientRect().width;
        if (Math.abs(offset - innerWidth) < 3) {
            this.isMouseMove = true;
        }
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
