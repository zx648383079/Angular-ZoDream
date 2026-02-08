import { DestroyRef, Directive, DOCUMENT, ElementRef, HostListener, inject, input, output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';
import * as events from './events';
import { Scroll } from '../../../theme/models/scroll';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { documentHeight, isHidden, scrollTop, windowHeight } from '../../../theme/utils/doc';

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
export class InfiniteScrollDirective {
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
    private readonly document = inject<Document>(DOCUMENT);
    private readonly destroyRef = inject(DestroyRef);
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
    public readonly scroll$: Subject<Scroll> = new Subject<Scroll>();

    constructor() {
        this.scroll$
        .pipe(
            takeUntilDestroyed(this.destroyRef),
            debounceTime(this.debounce()),
            map(scroll => {
                const y = scroll.y + this.offset();
                return { y, height: scroll.height };
            }),
            filter(() => !this.disabled() && !isHidden(this.elementRef.nativeElement)),
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
        scrollHeight: number,
        offsetHeight: number,
    ): void {
        const height = scrollHeight;
        const y = scrollY + offsetHeight;
        this.scroll$.next({ y, height });
    }

    @HostListener('window:scroll', [])
    public onWindowScroll(): void {
        const y = scrollTop(this.document) + windowHeight(this.document);
        const height = documentHeight(this.document);
        this.scroll$.next({ y, height });
    }
}
