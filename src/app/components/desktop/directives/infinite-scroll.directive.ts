import { Directive, AfterViewInit, OnDestroy, HostListener, input, output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, map, filter } from 'rxjs/operators';
import * as events from './events';
import { Scroll } from '../../../theme/models/scroll';

/**
 * @example
 * ```html
 * <div
 *   class="foo"
 *   appInfiniteScroll
 *   (scrollEnd)="onScrollEnd()"
 *   [offset]="100"
 *   [debounce]="123"
 *   [disabled]="disabled">
 * </div>
 * ```
 *
 */
@Directive({
    standalone: false,
    selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective  implements AfterViewInit, OnDestroy {
    /**
    * Event that will be triggered when user has scrolled to
    * bottom of the element
    */
    public readonly scrollEnd = output<void>();
    /**
    * An offset from the bottom of the element to trigger
    * `scrollEnd` event
    */
    public readonly offset = input(0);
    /**
    * Specify debounce duration in ms
    */
    public readonly debounce = input(100);
    /**
    * If true then `scrollEnd` event should NOT be emitted
    */
    public readonly disabled = input(false);
    /**
    * Emits a new value on element scroll event
    */
    public scroll$: Subject<Scroll> = new Subject<Scroll>();
    /**
    * Completes on component destroy lifecycle event
    * used to unsubscribe from infinite observables
    *
    */
    private ngUnsubscribe$ = new Subject<void>();
    /**
    * Subscribe to `scroll$` observable and emit `scrollEnd` event
    * when element scroll position is at the end of the element
    */
    public ngAfterViewInit(): void {
        this.scroll$
        .pipe(
            takeUntil(this.ngUnsubscribe$),
            debounceTime(this.debounce()),
            map(scroll => {
                const y = scroll.y + this.offset();
                return { y, height: scroll.height };
            }),
            filter(() => !this.disabled()),
            filter(scroll => scroll.y >= scroll.height),
        )
        .subscribe(() => this.scrollEnd.emit());
    }
    /**
    * On element scroll event emit next `scroll$` observable value
    */
    @HostListener(events.eventScroll, events.eventPathScroll)
    public onScroll(
        scrollY: number,
        scrollheight: number,
        offsetHeight: number,
    ): void {
        const height = scrollheight;
        const y = scrollY + offsetHeight;
        this.scroll$.next({ y, height });
    }
    /**
    * trigger `ngUnsubscribe` complete on
    * component destroy lifecycle hook
    */
    public ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
