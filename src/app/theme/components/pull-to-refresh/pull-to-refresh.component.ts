import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
    HostListener,
    Renderer2
} from '@angular/core';

export enum ESTATE {
    NONE = 0,
    PULL = 1,
    PULLED = 2,
    CANCEL = 3,
    REFRESHING = 4,
    REFRESHED = 5,
    MORE = 6,
    LOADING = 7,
    LOADED = 8,
}

enum EDIRECTION {
    NONE = 0,
    DOWN = 1,
    UP = 2,
}

@Component({
    selector: 'app-pull-to-refresh',
    templateUrl: './pull-to-refresh.component.html',
    styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public refresh = true;
    @Input() public more = true;
    @Input() public distance = 10;
    @Input() public loading = false;
    @Input() public maxHeight = 100;
    public ESTATE = ESTATE;
    public state: ESTATE = ESTATE.NONE;
    public startY = 0;
    public startUp: EDIRECTION = EDIRECTION.NONE; // 一开始滑动的方向
    @ViewChild('pullScroll')
    public boxRef: ElementRef;
    public scrollTop = 0;
    public topHeight = 0;

    @Output() public stateChange = new EventEmitter < ESTATE > ();
    @Output() public moreChange = new EventEmitter < boolean > ();
    @Output() public topHeightChange = new EventEmitter < number > ();
    @Output() public refreshChange = new EventEmitter < boolean > ();

    constructor(
        private renderer: Renderer2,
    ) {}

    ngOnInit() {
        this.renderer.listen(window, 'scroll', this.onScroll.bind(this));
    }

    ngOnDestroy() {
        // window.removeEventListener('scroll', this.onScroll);
    }

    @HostListener('scroll', [
        '$event.target.scrollTop',
        '$event.target.scrollHeight',
        '$event.target.offsetHeight',
    ])
    public onDivScroll(
        scrollY: number,
        scrollheight: number,
        offsetHeight: number,
    ): void {
        const height = scrollheight;
        const y = scrollY + offsetHeight;
        if (this.more && y + this.distance > height) {
            this.state = ESTATE.MORE;
            this.moreChange.emit(this.more);
        }
    }

    get box(): HTMLDivElement {
        return this.boxRef.nativeElement as HTMLDivElement;
    }

    get style(): string {
        return 'height: ' + this.topHeight + 'px';
    }

    ngOnChanges(current: SimpleChanges) {
        if (current.state) {
            this.stateChange.emit(current.statte.currentValue);
        }
        if (current.more) {
            if (!current.more.currentValue && this.state === ESTATE.MORE) {
                this.state = ESTATE.NONE;
            }
        }
        if (current.topHeight) {
            this.topHeightChange.emit(current.topHeight.currentValue);
        }
        if (current.loading) {
            this.onLoadingChanged(current.loading.currentValue, current.loading.previousValue);
        }
    }

    public onLoadingChanged(val: boolean, oldVal: boolean) {
        if (val && !oldVal) {
            if (this.state === ESTATE.PULLED) {
                this.state = ESTATE.REFRESHING;
                return;
            }
            if (this.state === ESTATE.MORE) {
                this.state = ESTATE.LOADING;
                return;
            }
        }

        if (oldVal && !val) {
            if (this.state === ESTATE.LOADING) {
                this.state = ESTATE.LOADED;
                this.reset();
                return;
            }
            if (this.state === ESTATE.REFRESHING) {
                this.state = ESTATE.REFRESHED;
                this.reset();
                return;
            }
            if (this.state === ESTATE.MORE) {
                this.state = ESTATE.NONE;
                return;
            }
        }
    }

    /**
     * 开始加载
     */
    public startLoad() {
        this.onLoadingChanged(true, false);
    }

    /**
     * 加载完成
     */
    public endLoad() {
        this.onLoadingChanged(false, true);
    }

    public onScroll(event: any) {
        if (!this.more) {
            return;
        }
        if (this.getScrollBottomHeight() > this.distance) {
            return;
        }
        this.state = ESTATE.MORE;
        this.moreChange.emit(this.more);
    }

    public touchStart(event: TouchEvent) {
        if (this.scrollTop > 0) {
            return;
        }
        this.startY = event.targetTouches[0].pageY;
        this.startUp = EDIRECTION.NONE;
    }

    public touchMove(event: TouchEvent) {
        if (this.scrollTop > 0 && this.state === ESTATE.NONE) {
            return;
        }
        const diff = event.changedTouches[0].pageY - this.startY;
        if (this.startUp === EDIRECTION.NONE) {
            this.startUp = diff > 0 ? EDIRECTION.DOWN : EDIRECTION.UP;
        }
        // 进行滑动操作
        if (this.startUp === EDIRECTION.DOWN) {
            if (this.state === ESTATE.NONE && diff > 0) {
                this.state = ESTATE.PULL;
            }
            if (this.state === ESTATE.PULL && diff >= this.maxHeight) {
                this.state = ESTATE.PULLED;
            }
            if (this.state === ESTATE.PULLED && diff < this.maxHeight) {
                this.state = ESTATE.CANCEL;
            }
            if (this.state === ESTATE.PULL) {
                this.topHeight = diff;
            }
        }
        // 上拉加载更多
        if (this.startUp === EDIRECTION.UP && this.more) {
            this.state = Math.abs(diff) > this.distance ? ESTATE.MORE : ESTATE.NONE;
        }
    }

    public touchEnd(event: TouchEvent) {
        if (this.scrollTop > 0) {
            return;
        }
        const diff = event.changedTouches[0].pageY - this.startY;
        if (this.state === ESTATE.PULL || this.state === ESTATE.CANCEL) {
            this.state = ESTATE.NONE;
            return;
        }
        if (this.state === ESTATE.PULLED) {
            this.refreshChange.emit(this.refresh);
            return;
        }
        if (this.state === ESTATE.MORE) {
            this.moreChange.emit(this.more);
        }
    }

    public animation(
        start: number, end: number, endHandle ?: () => void) {
        const diff = start > end ? -1 : 1;
        let step = 1;
        const handle = setInterval(() => {
            start += (step++) * diff;
            if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
                clearInterval(handle);
                this.topHeight = end;
                if (endHandle) {
                    endHandle();
                }
                return;
            }
            this.topHeight = start;
        }, 16);
    }

    public reset() {
        this.animation(this.topHeight, 0, () => {
            this.state = ESTATE.NONE;
        });
    }

    // 滚动条到底部的距离
    public getScrollBottomHeight() {
        this.scrollTop = this.getScrollTop();
        return this.getPageHeight() - this.scrollTop - this.getWindowHeight();
    }

    // 页面高度
    public getPageHeight() {
        const box = document.querySelector('html');
        if (!box) {
            return 0;
        }
        return box.scrollHeight;
    }

    // 滚动条顶 高度
    public getScrollTop() {
        let scrollTop = 0;
        let bodyScrollTop = 0;
        let documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }

    public getWindowHeight() {
        let windowHeight = 0;
        if (document.compatMode === 'CSS1Compat') {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

}
