import { Component, OnInit, ElementRef, OnDestroy, HostListener, Renderer2, inject, input, output, viewChild, effect, model } from '@angular/core';

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
    standalone: false,
    selector: 'app-pull-to-refresh',
    templateUrl: './pull-to-refresh.component.html',
    styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent implements OnInit, OnDestroy {
    private renderer = inject(Renderer2);


    /**
     * 是否允许刷新
     */
    public readonly refresh = model(true);
    /**
     * 是否可以加载更多
     */
    public readonly more = model(true);
    /**
     * 距离底部距离触发加载更多
     */
    public readonly distance = input(10);
    /**
     * 是否加载中
     */
    public readonly loading = input(false);
    public readonly maxHeight = input(100);
    public ESTATE = ESTATE;
    public startY = 0;
    public startUp: EDIRECTION = EDIRECTION.NONE; // 一开始滑动的方向
    public readonly boxRef = viewChild<ElementRef>('pullScroll');
    public scrollTop = 0;

    public readonly state = model<ESTATE>(ESTATE.NONE);
    public readonly topHeight = model<number>(0);

    constructor() {
        effect(() => {
            if (!this.more() && this.state() === ESTATE.MORE) {
                this.state.set(ESTATE.NONE);
            }
        });
        let lastLoading = false;
        effect(() => {
            this.onLoadingChanged(this.loading(), lastLoading);
            lastLoading = this.loading();
        });
    }

    ngOnInit() {
        this.renderer.listen(window, 'scroll', this.onScroll.bind(this));
    }

    ngOnDestroy() {
        // window.removeEventListener('scroll', this.onScroll);
    }

    @HostListener('scroll', [
        '$event'
    ])
    public onDivScroll(
        event: Event
    ): void {
        const target = event.target as HTMLElement;
        const height = target.scrollHeight;
        const y = target.scrollTop + target.offsetHeight;
        const more = this.more();
        if (more && y + this.distance() > height) {
            this.state.set(ESTATE.MORE);
            this.more.set(true);
        }
    }

    get box(): HTMLDivElement {
        return this.boxRef().nativeElement as HTMLDivElement;
    }

    get style(): string {
        return 'height: ' + this.topHeight + 'px';
    }

    public onLoadingChanged(val: boolean, oldVal: boolean) {
        const state = this.state();
        if (val && !oldVal) {
            if (state === ESTATE.PULLED) {
                this.state.set(ESTATE.REFRESHING);
                return;
            }
            if (state === ESTATE.MORE) {
                this.state.set(ESTATE.LOADING);
                return;
            }
        }

        if (oldVal && !val) {
            if (state === ESTATE.LOADING) {
                this.state.set(ESTATE.LOADED);
                this.reset();
                return;
            }
            if (state === ESTATE.REFRESHING) {
                this.state.set(ESTATE.REFRESHED);
                this.reset();
                return;
            }
            if (state === ESTATE.MORE) {
                this.state.set(ESTATE.NONE);
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
        const more = this.more();
        if (!more) {
            return;
        }
        if (this.getScrollBottomHeight() > this.distance()) {
            return;
        }
        this.state.set(ESTATE.MORE);
        this.more.set(more);
    }

    public touchStart(event: TouchEvent) {
        if (this.scrollTop > 0) {
            return;
        }
        this.startY = event.targetTouches[0].pageY;
        this.startUp = EDIRECTION.NONE;
    }

    public touchMove(event: TouchEvent) {
        const state = this.state();
        if (this.scrollTop > 0 && state === ESTATE.NONE) {
            return;
        }
        const diff = event.changedTouches[0].pageY - this.startY;
        if (this.startUp === EDIRECTION.NONE) {
            this.startUp = diff > 0 ? EDIRECTION.DOWN : EDIRECTION.UP;
        }
        // 进行滑动操作
        if (this.startUp === EDIRECTION.DOWN) {
            if (state === ESTATE.NONE && diff > 0) {
                this.state.set(ESTATE.PULL);
            }
            if (state === ESTATE.PULL && diff >= this.maxHeight()) {
                this.state.set(ESTATE.PULLED);
            }
            if (state === ESTATE.PULLED && diff < this.maxHeight()) {
                this.state.set(ESTATE.CANCEL);
            }
            if (state === ESTATE.PULL) {
                this.topHeight.set(diff);
            }
        }
        // 上拉加载更多
        if (this.startUp === EDIRECTION.UP && this.more()) {
            this.state.set(Math.abs(diff) > this.distance() ? ESTATE.MORE : ESTATE.NONE);
        }
    }

    public touchEnd(event: TouchEvent) {
        if (this.scrollTop > 0) {
            return;
        }
        const diff = event.changedTouches[0].pageY - this.startY;
        const state = this.state();
        if (state === ESTATE.PULL || state === ESTATE.CANCEL) {
            this.state.set(ESTATE.NONE);
            return;
        }
        if (state === ESTATE.PULLED) {
            this.refresh.set(this.refresh());
            return;
        }
        if (state === ESTATE.MORE) {
            this.more.set(this.more());
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
                this.topHeight.set(end);
                if (endHandle) {
                    endHandle();
                }
                return;
            }
            this.topHeight.set(start);
        }, 16);
    }

    public reset() {
        this.animation(this.topHeight(), 0, () => {
            this.state.set(ESTATE.NONE);
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
