import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit,
    HostListener
} from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements AfterViewInit {

    @ViewChild('progressBox')
    private box: ElementRef;

    /**
     * 当前值
     */
    @Input() public value = 0;
    /**
     * 最大值
     */
    @Input() public max = 100;
    /**
     * 最小移动值
     */
    @Input() public min = 0;
    @Input() public label = true;
    @Input() public theme = 'progress'; // .progress-primary
    @Output() public valueChange = new EventEmitter();
    private isMouseMove = false;

    constructor() {}

    public get progressStyle() {
        return {
            width: this.max < 1 ? 0 : (this.value * 100 / this.max)  + '%'
        };
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: any) {
        if (!this.isMouseMove) {
            return;
        }
        const div = this.box.nativeElement as HTMLDivElement;
        const bound = div.getBoundingClientRect();
        const offset = event.clientX - bound.left;
        this.tapProgress(offset * 100 / bound.width);
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.isMouseMove = false;
    }

    ngAfterViewInit(): void {
        const div = this.box.nativeElement as HTMLDivElement;
        div.addEventListener('click', (event) => {
            const bound = div.getBoundingClientRect();
            this.tapProgress((event.clientX - bound.left) * 100 / bound.width);
        });
        div.addEventListener('mousedown', (event) => {
            const bound = div.getBoundingClientRect();
            const offset = event.clientX - bound.left;
            const innerWidth = div.querySelector('.progress-bar').getBoundingClientRect().width;
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
        this.valueChange.emit(this.value = this.max === 100 ? i : (i * this.max / 100));
    }
}
