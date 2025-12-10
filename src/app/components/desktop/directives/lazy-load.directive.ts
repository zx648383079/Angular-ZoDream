import { isPlatformServer } from '@angular/common';
import { Directive, ElementRef, HostListener, OnDestroy, OnInit, PLATFORM_ID, Renderer2, inject, input, output } from '@angular/core';
import { assetUri } from '../../../theme/utils';

interface IRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

@Directive({
    standalone: false,
    selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
    private elementRef = inject(ElementRef);
    private platformId = inject(PLATFORM_ID);


    /** 指定屏幕宽度最小值 */
    public readonly min = input(0);
    /** 指定屏幕宽度最大值 */
    public readonly max = input(0);
    /** 指定加载次数 */
    public loadTime = 1;
    public readonly scrollTarget = input<any>(undefined);
    public readonly offset = input(0);
    public readonly appLazyLoad = input('');
    public readonly lazyLoading = output<void>();

    private lastIsVisible = false;

    ngOnInit() {
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
        const appLazyLoad = this.appLazyLoad();
        if (appLazyLoad) {
            const element = this.elementRef.nativeElement;
            const tagName = element.tagName.toLocaleLowerCase();
            if (tagName === 'img') {
                (element as HTMLImageElement).src = assetUri(appLazyLoad);
            }
        }
        this.lazyLoading.emit();
    }

    @HostListener('window:scroll', [])
    @HostListener('window:resize', [])
    public onScroll() {
        if (typeof window === 'undefined' || this.isDisabled()) {
            return;
        }
        const width = document.body.clientWidth;
        if (this.min() > 0 && this.min() > width) {
            return;
        }
        if (this.max() > 0 && this.max() < width) {
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
        const offset = this.offset();
        if (offset !== 0) {
            elementBounds.top -= offset;
            elementBounds.left -= offset;
            elementBounds.bottom += offset;
            elementBounds.right += offset;
        }
        const scrollTarget = this.scrollTarget();
        if (!scrollTarget) {
            return this.intersectsWith(elementBounds, windowBounds);
        }
        const scrollContainerBounds: IRect = (scrollTarget instanceof ElementRef ?
            this.elementRef.nativeElement : scrollTarget).getBoundingClientRect();
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
