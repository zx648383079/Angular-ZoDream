import { AfterContentInit, AfterViewInit, Component, ElementRef, HostBinding, HostListener, 
    OnDestroy, Renderer2, ViewEncapsulation, inject, input, contentChildren, effect } from '@angular/core';
import { SwiperItemComponent } from './swiper-item.component';
import { checkLoopRange } from '../../theme/utils';
import { BehaviorSubject } from 'rxjs';
import { AnimationTween } from '../../theme/utils/tween';
import { SwiperEvent } from './model';

@Component({
    standalone: false,
    selector: 'app-swiper',
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
    host: {
        'class': 'swiper',
    },
})
export class SwiperComponent implements AfterViewInit, AfterContentInit, OnDestroy, SwiperEvent {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);


    public readonly items = contentChildren(SwiperItemComponent);
    public readonly navigation = input(true);
    public readonly width = input(0);
    public readonly height = input(0);
    public readonly autoplay = input(false);
    public readonly duration = input(5000);
    public readonly pauseOnOver = input(true);
    public readonly keyboard = input(true);
    public readonly touchable = input(true);
    @HostBinding('class')
    public readonly theme = input('swiper-theme-default');
    public navigationVisible = false;
    public previousVisible = false;
    public nextVisible = false;
    public index = -1;
    public bodyStyle = {};
    private resize$: ResizeObserver;
    private itemCount$ = new BehaviorSubject(0);
    private maxWidth = 0;
    private isLoop = false;
    private tween = new AnimationTween(this.duration());

    constructor() {
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
            this.navigationVisible = this.navigation() && res > 1;
            this.updateAction();
        });
        this.tween.finish$.subscribe(() => {
            this.next();
        });
        effect(() => {
            this.tween.timeout = this.duration();
        });
        effect(() => {
            this.autoplay();
            this.tween.next();
        });
        effect(() => {
            this.itemCount$.next(this.items().length);
        });
    }
    

    @HostListener('document:mouseup', ['$event'])
    public onMouseUp(e: MouseEvent) {
        if (!this.touchable()) {
            return;
        }
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        if (!this.touchable()) {
            return;
        }
    }

    @HostListener('mouseover', [])
    public onMouseOver() {
        if (!this.pauseOnOver()) {
            return;
        }
        this.tween.stop();
    }

    @HostListener('mouseleave', [])
    public onMouseLeave() {
        if (!this.pauseOnOver() || !this.autoplay()) {
            return;
        }
        this.tween.next();
    }

    ngAfterViewInit(): void {
        const box = this.elementRef.nativeElement;
        this.resize$.observe(box);
        if (!this.touchable()) {
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
        const items = this.items();
        this.itemCount$.next(items.length);
        setTimeout(() => {
            this.navigate(Math.max(0, this.index));
        }, 1);
    }

    ngOnDestroy(): void {
        this.resize$.disconnect();
        this.itemCount$.unsubscribe();
        this.tween.close();
    }

    public get backable(): boolean {
        return true;
    }
    public get nextable(): boolean {
        return true;
    }
    public back(): void {
        this.navigate(this.index - 1);
    }
    public next(): void {
        this.navigate(this.index + 1);
    }

    public navigate(index: number): void {
        this.tween.stop();
        const lastIndex = this.index;
        this.index = checkLoopRange(index, this.items().length - 1);
        this.updateAction();
        if (this.index === lastIndex) {
            return;
        }
        this.items().at(this.index).active = true;
        if (lastIndex >= 0 && lastIndex < this.items().length) {
            this.items().at(lastIndex).active = false;
        }
        if (this.autoplay()) {
            this.tween.next();
        }
    }

    private updateAction() {
        this.previousVisible = this.itemCount$.value > 0 && (this.isLoop || this.index > 0);
        this.nextVisible = this.itemCount$.value > 0 && (this.isLoop || this.index < this.items().length - 1);
    }

}
