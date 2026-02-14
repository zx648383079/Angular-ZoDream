import { DOCUMENT, Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { scrollTop, toggleClass } from '../../../theme/utils/doc';

@Directive({
    standalone: false,
    selector: '[appScrollFixed]'
})
export class ScrollFixedDirective {
    private readonly document = inject<Document>(DOCUMENT);
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    public readonly appScrollFixed = input<string>();
    public readonly whenScrollTop = input(true);

    private lastOffset = 0;
    private lastScrollTop = 0;

    constructor() {
        this.onResize();
    }

    @HostListener('window:resize', [])
    public onResize() {
        const target = this.elementRef.nativeElement;
        if (!target) {
            return;
        }
        const appScrollFixed = this.appScrollFixed();
        if (appScrollFixed && target.classList.contains(appScrollFixed)) {
            return;
        }
        this.lastOffset = target.getBoundingClientRect().top + scrollTop(this.document);
    }

    @HostListener('window:scroll', [])
    public onScroll(): void {
        const target = this.elementRef.nativeElement;
        const oldTop = this.lastScrollTop;
        const sT = this.lastScrollTop = scrollTop(this.document);
        if (sT <= this.lastOffset) {
            toggleClass(target, this.appScrollFixed(), false);
            return;
        }
        if (this.whenScrollTop()) {
            toggleClass(target, this.appScrollFixed(), oldTop > sT);
            return;
        }
        toggleClass(target, this.appScrollFixed(), true);
    }
}
