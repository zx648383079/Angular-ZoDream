import { Component, HostListener, inject, input, effect, model, computed, signal, DOCUMENT } from '@angular/core';
import { interval } from 'rxjs';
import { TouchDirection } from '../model';
import { scrollBottom, scrollTop } from '../../../theme/utils/doc';
import { ButtonEvent } from '../../form';

export enum PullState {
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

@Component({
    standalone: false,
    selector: 'app-pull-to-refresh',
    templateUrl: './pull-to-refresh.component.html',
    styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent implements ButtonEvent {
    private readonly document = inject<Document>(DOCUMENT);
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

    public readonly state = model(PullState.NONE);
    public readonly topHeight = model<number>(0);

    private startY = 0;
    private startUp = TouchDirection.None; // 一开始滑动的方向
    private scrollTop = 0;

    constructor() {
        effect(() => {
            if (!this.more() && this.state() === PullState.MORE) {
                this.state.set(PullState.NONE);
            }
        });
        let lastLoading = false;
        effect(() => {
            this.onLoadingChanged(this.loading(), lastLoading);
            lastLoading = this.loading();
        });
    }


    @HostListener('window:scroll', [])
    public onScroll() {
        const more = this.more();
        if (!more) {
            return;
        }
        this.scrollTop = scrollTop(this.document);
        if (scrollBottom(this.document) > this.distance()) {
            return;
        }
        this.state.set(PullState.MORE);
        this.more.set(more);
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
            this.state.set(PullState.MORE);
            this.more.set(true);
        }
    }

    @HostListener('touchstart', ['$event'])
    public onTouchStart(e: TouchEvent) {
        this.touchStart(e.targetTouches[0].pageY);
    }

    @HostListener('touchmove', ['$event'])
    public onTouchMove(e: TouchEvent) {
        this.touchMove(e.changedTouches[0].pageY);
    }

    @HostListener('touchend', [])
    public onTouchEnd() {
        this.touchEnd();
    }

    public readonly topStyle = computed(() => {
        return {
            height: this.topHeight + 'px'
        };
    });
    public readonly isPullState = computed(() => {
        const state = this.state();
        return state > PullState.NONE && state < PullState.MORE;
    });

    public readonly isLoadState = computed(() => {
        const state = this.state();
        return state >= PullState.MORE;
    });

    public readonly stateIcon = computed(() => {
        switch (this.state()) {
            case PullState.PULL:
                return 'icon-arrow-down';
            case PullState.CANCEL:
            case PullState.PULLED:
            case PullState.LOADED:
                return 'icon-arrow-up';
            case PullState.REFRESHING:
            case PullState.MORE:
                return 'icon-refresh';
            case PullState.REFRESHED:
            case PullState.LOADING:
                return 'icon-check';
            default:
                return '';
        }
    });
    public readonly stateLabel = computed(() => {
        switch (this.state()) {
            case PullState.PULL:
                return $localize `Pull to refresh`;
            case PullState.PULLED:
                return $localize `Release to refresh`;
            case PullState.CANCEL:
                return $localize `Stop refresh`;
            case PullState.REFRESHING:
                return $localize `Refresh...`;
            case PullState.REFRESHED:
                return $localize `Refresh finished`;
            case PullState.MORE:
                return $localize `Load More`;
            case PullState.LOADING:
                return $localize `Loading...`;
            case PullState.LOADED:
                return $localize `Loaded`;
            default:
                return '';
        }
    });

    public onLoadingChanged(val: boolean, oldVal: boolean) {
        const state = this.state();
        if (val && !oldVal) {
            if (state === PullState.PULLED) {
                this.state.set(PullState.REFRESHING);
                return;
            }
            if (state === PullState.MORE) {
                this.state.set(PullState.LOADING);
                return;
            }
        }

        if (oldVal && !val) {
            if (state === PullState.LOADING) {
                this.state.set(PullState.LOADED);
                this.resetState();
                return;
            }
            if (state === PullState.REFRESHING) {
                this.state.set(PullState.REFRESHED);
                this.resetState();
                return;
            }
            if (state === PullState.MORE) {
                this.state.set(PullState.NONE);
                return;
            }
        }
    }

    /**
     * 开始加载
     */
    public enter() {
        this.onLoadingChanged(true, false);
    }

    /**
     * 加载完成
     */
    public reset() {
        this.onLoadingChanged(false, true);
    }



    public touchStart(y: number) {
        if (this.scrollTop > 0) {
            return;
        }
        this.startY = y;
        this.startUp = TouchDirection.None;
    }

    public touchMove(y: number) {
        const state = this.state();
        if (this.scrollTop > 0 && state === PullState.NONE) {
            return;
        }
        const diff = y - this.startY;
        if (this.startUp === TouchDirection.None) {
            this.startUp = diff > 0 ? TouchDirection.Bottom : TouchDirection.Top;
        }
        // 进行滑动操作
        if (this.startUp === TouchDirection.Bottom) {
            if (state === PullState.NONE && diff > 0) {
                this.state.set(PullState.PULL);
            }
            if (state === PullState.PULL && diff >= this.maxHeight()) {
                this.state.set(PullState.PULLED);
            }
            if (state === PullState.PULLED && diff < this.maxHeight()) {
                this.state.set(PullState.CANCEL);
            }
            if (state === PullState.PULL) {
                this.topHeight.set(diff);
            }
        }
        // 上拉加载更多
        if (this.startUp === TouchDirection.Top && this.more()) {
            this.state.set(Math.abs(diff) > this.distance() ? PullState.MORE : PullState.NONE);
        }
    }

    public touchEnd() {
        if (this.scrollTop > 0) {
            return;
        }
        const state = this.state();
        if (state === PullState.PULL || state === PullState.CANCEL) {
            this.state.set(PullState.NONE);
            return;
        }
        if (state === PullState.PULLED) {
            this.refresh.set(this.refresh());
            return;
        }
        if (state === PullState.MORE) {
            this.more.set(this.more());
        }
    }

    public animation(
        start: number, end: number, endHandle ?: () => void) {
        const diff = start > end ? -1 : 1;
        let step = 1;
        const handle = interval(16).subscribe(() => {
            start += (step++) * diff;
            if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
                handle.unsubscribe();
                this.topHeight.set(end);
                if (endHandle) {
                    endHandle();
                }
                return;
            }
            this.topHeight.set(start);
        });
    }

    private resetState() {
        this.animation(this.topHeight(), 0, () => {
            this.state.set(PullState.NONE);
        });
    }

}
