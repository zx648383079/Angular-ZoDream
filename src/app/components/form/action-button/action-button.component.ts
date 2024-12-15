import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonEvent } from '../event';

@Component({
    standalone: false,
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss'],
    host: {
        '(click)': 'tapBody()',
    },
})
export class ActionButtonComponent implements OnChanges, AfterViewInit, ButtonEvent {

    @Input() public disabled = false;
    @Input() public loading = false;
    @Output() public tapped = new EventEmitter<ButtonEvent>();
    private height = 0;

    constructor(
        private elementRef: ElementRef<HTMLDivElement>
    ) { }

    get loadingStyle() {
        const width = this.height - 10;
        return {
            height: width + 'px',
            width: width + 'px',
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled) {
            this.toggleClass('disabled', changes.disabled.currentValue);
        }
    }

    ngAfterViewInit() {
        if (this.height > 0) {
            return;
        }
        const ele = this.elementRef.nativeElement;
        const bound = ele.getBoundingClientRect();
        const style = getComputedStyle(ele);
        const toInt = (val: string): number => {
            return parseInt(val.replace(/[^\d]+/g, ''), 10)
        };
        this.height = bound.height - toInt(style.paddingTop) - toInt(style.paddingBottom);
    }

    /**
     * 开始执行加载
     */
    public enter() {
        this.loading = true;
        this.toggleClass('disabled', true);
    }

    /**
     * 停止执行
     */
    public reset() {
        this.loading = false;
        this.toggleClass('disabled', this.disabled);
    }

    public tapBody() {
        if (this.disabled || this.loading) {
            return;
        }
        this.tapped.emit(this);
    }

    private toggleClass(name: string, force?: boolean) {
        const ele = this.elementRef.nativeElement;
        if (force === void 0) {
            force = !ele.classList.contains(name);
        }
        if (force) {
            ele.classList.add(name);
            return;
        }
        ele.classList.remove(name);
    }
}
