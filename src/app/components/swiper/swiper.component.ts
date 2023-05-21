import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, HostBinding, HostListener, Input, NgZone, OnChanges, OnDestroy, QueryList, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SwiperItemComponent } from './swiper-item.component';
import { checkLoopRange } from '../../theme/utils';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-swiper',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
    host: {
        'class': 'swiper',
    },
})
export class SwiperComponent implements AfterViewInit, AfterContentInit, OnDestroy, OnChanges {

    @ContentChildren(SwiperItemComponent) 
    public items: QueryList<SwiperItemComponent>;
    @Input() private navigation = true;
    @Input() private width = 0;
    @Input() private height = 0;
    @Input() private autoplay = false;
    @Input() private duration = 3000;
    @Input() private pauseOnOver = true;
    @Input() private keyboard = true;
    @Input() private touchable = true;
    @Input()
    @HostBinding('class')
    public theme = 'swiper-theme-default';
    public navigationVisible = false;
    public previousVisible = false;
    public nextVisible = false;
    public index = -1;
    public bodyStyle = {};
    private resize$: ResizeObserver;
    private itemCount$ = new BehaviorSubject(0);
    private maxWidth = 0;
    private isLoop = false;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private zone: NgZone,
    ) {
        this.resize$ = new ResizeObserver(entries => {
            for (const item of entries) {
                if (item.contentRect.width === this.maxWidth) {
                    return;
                }
                this.maxWidth = item.contentRect.width;
                // console.log(item);
            }
        });
        this.itemCount$.subscribe(res => {
            this.navigationVisible = this.navigation && res > 1;
            this.updateAction();
        });
    }

    @HostListener('document:mouseup', ['$event'])
    private onMouseUp(e: MouseEvent) {
        if (!this.touchable) {
            return;
        }
    }

    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent) {
        if (!this.touchable) {
            return;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        
    }

    ngAfterViewInit(): void {
        const box = this.elementRef.nativeElement;
        this.resize$.observe(box);
        if (!this.touchable) {
            return;
        }
        this.renderer.listen(box, 'mousedown', (e: MouseEvent) => {

        });
        this.renderer.listen(box, 'touchstart', (e: TouchEvent) => {
            e.targetTouches[0].clientX;
        });
        this.renderer.listen(box, 'touchmove', (e: TouchEvent) => {
            e.touches[0].clientX;
        });
        this.renderer.listen(box, 'touchend', (e: TouchEvent) => {
            e.changedTouches[0].clientX;
        });
    }

    ngAfterContentInit(): void {
        this.itemCount$.next(this.items.length);
        this.items.changes.subscribe(() => {
            this.itemCount$.next(this.items.length);
        });
        setTimeout(() => {
            this.tapIndex(0);
        }, 1);
    }

    ngOnDestroy(): void {
        this.resize$.disconnect();
        this.itemCount$.unsubscribe();
    }

    public tapPrevious() {
        this.tapIndex(this.index - 1);
    }

    public tapNext() {
        this.tapIndex(this.index + 1);
    }

    public tapIndex(i: number) {
        const lastIndex = this.index;
        this.index = checkLoopRange(i, this.items.length - 1);
        this.updateAction();
        if (this.index === lastIndex) {
            return;
        }
        this.items.get(this.index).active = true;
        if (lastIndex >= 0 && lastIndex < this.items.length) {
            this.items.get(lastIndex).active = false;
        }
    }

    private updateAction() {
        this.previousVisible = this.itemCount$.value > 0 && (this.isLoop || this.index > 0);
        this.nextVisible = this.itemCount$.value > 0 && (this.isLoop || this.index < this.items.length - 1);
    }

}
