import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';

@Component({
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

    @Output() public valueChange = new EventEmitter();

    constructor() {}

    public get progressStyle() {
        return {
            width: this.max < 1 ? 0 : (this.value * 100 / this.max)  + '%'
        };
    }

    ngAfterViewInit(): void {
        const div = this.box.nativeElement as HTMLDivElement;
        div.addEventListener('click', (event) => {
            const bound = div.getBoundingClientRect();
            this.tapProgress((event.clientX - bound.left) * 100 / bound.width);
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
