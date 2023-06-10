import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Directive, ElementRef,
    EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { assetUri } from '../utils';

interface IRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {

    /** 指定屏幕宽度最小值 */
    @Input() public min = 0;
    /** 指定屏幕宽度最大值 */
    @Input() public max = 0;
    /** 指定加载次数 */
    @Input() public loadTime = 1;
    @Input() public scrollTarget?: any;
    @Input() public offset = 0;
    @Input() public appLazyLoad = '';
    @Output() public lazyLoading = new EventEmitter<void>();

    private lastIsVisible = false;

    constructor(
        private elementRef: ElementRef,
        @Inject(PLATFORM_ID) private platformId: any,
        private renderer: Renderer2,
    ) { }

    ngOnInit() {
        this.renderer.listen(window, 'scroll', this.onScroll.bind(this));
        this.renderer.listen(window, 'resize', this.onScroll.bind(this));
        this.emitInit();
    }

    ngOnDestroy() {

    }

    private emitInit() {
        const oldTime = this.loadTime;
        this.onScroll();
        if (oldTime != this.loadTime) {
            return;
        }
        if (!this.elementRef.nativeElement) {
            return;
        }
        const element = this.elementRef.nativeElement;
        const tagName = element.tagName.toLocaleLowerCase();
        if (tagName === 'img') {
            (element as HTMLImageElement).src = assetUri('assets/images/thumb.jpg');
            return;
        }
    }

    private emitLoad() {
        if (this.appLazyLoad) {
            const element = this.elementRef.nativeElement;
            const tagName = element.tagName.toLocaleLowerCase();
            if (tagName === 'img') {
                (element as HTMLImageElement).src = assetUri(this.appLazyLoad);
            }
        }
        this.lazyLoading.emit();
        
    }

    private onScroll() {
        if (typeof window === 'undefined' || this.isDisabled()) {
            return;
        }
        const width = document.body.clientWidth;
        if (this.min > 0 && this.min > width) {
            return;
        }
        if (this.max > 0 && this.max < width) {
            return;
        }
        if (this.loadTime < 1) {
            return;
        }
        if (!this.isVisible(this.elementRef.nativeElement)) {
            this.lastIsVisible = false;
            return;
        }
        if (this.lastIsVisible) {
            return;
        }
        this.emitLoad();
        this.loadTime --;
        this.lastIsVisible = true;
    }

    private isVisible(element: HTMLDivElement) {
        if (!element || element.style.display === 'none') {
            return false;
        }
        const elementBounds: IRect = element.getBoundingClientRect();
        const windowBounds: IRect = {left: 0, top: 0, right: window.innerWidth, bottom:  window.innerHeight};
        if (this.offset !== 0) {
            elementBounds.top -= this.offset;
            elementBounds.left -= this.offset;
            elementBounds.bottom += this.offset;
            elementBounds.right += this.offset;
        }
        if (!this.scrollTarget) {
            return this.intersectsWith(elementBounds, windowBounds);
        }
        const scrollContainerBounds: IRect = (this.scrollTarget instanceof ElementRef ?
            this.elementRef.nativeElement : this.scrollTarget).getBoundingClientRect();
        const intersection = this.getIntersectionWith(scrollContainerBounds, windowBounds);
        return this.intersectsWith(elementBounds, intersection);
    }

    private intersectsWith(rect: IRect, boxRect: IRect): boolean {
        return boxRect.left < rect.right && rect.left < boxRect.right && boxRect.top < rect.bottom && rect.top < boxRect.bottom;
    }

    private getIntersectionWith(rect: IRect, boxRect: IRect): IRect {
        const left = Math.max(rect.left, boxRect.left);
        const top = Math.max(rect.top, boxRect.top);
        const right = Math.min(rect.right, boxRect.right);
        const bottom = Math.min(rect.bottom, boxRect.bottom);
        if (right >= left && bottom >= top) {
            return {left, top, right, bottom};
        }
        return {left: 0, top: 0, right: 0, bottom: 0};
      }

    private isDisabled(): boolean {
        // Disable if SSR and the user isn't a bot
        return isPlatformServer(this.platformId) && !this.isBot();
    }

    private isBot(): boolean {
        if (typeof window !== 'undefined' && window.navigator.userAgent) {
            return /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\ link\ preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|whatsapp|duckduckbot/i.test(
                window.navigator.userAgent
            );
        }
        return false;
    }
}
