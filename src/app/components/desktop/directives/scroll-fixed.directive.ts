import { Directive, ElementRef, HostListener, OnInit, inject, input } from '@angular/core';
import { scrollTop } from '../../../theme/utils/doc';

@Directive({
    standalone: false,
    selector: '[appScrollFixed]'
})
export class ScrollFixedDirective implements OnInit {
    private elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    public readonly appScrollFixed = input<string>(undefined);
    public readonly whenScrollTop = input(true);

    private lastOffset = 0;
    private lastScrollTop = 0;

    ngOnInit(): void {
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
        this.lastOffset = target.getBoundingClientRect().top + scrollTop();
    }

    @HostListener('window:scroll', [])
    public onScroll(): void {
        const oldTop = this.lastScrollTop;
        const sT = this.lastScrollTop = scrollTop();
        if (sT <= this.lastOffset) {
            this.toggleClass(this.appScrollFixed(), false);
            return;
        }
        if (this.whenScrollTop()) {
            this.toggleClass(this.appScrollFixed(), oldTop > sT);
            return;
        }
        this.toggleClass(this.appScrollFixed(), true);
    }

    public toggleClass(tag: string, force?: boolean) {
        if (!tag) {
            return;
        }
        const ele = this.elementRef.nativeElement;
        if (!ele) {
            return;
        }
        if (force === void 0) {
            force = !ele.classList.contains(tag);
        }
        if (ele.classList.contains(tag) === force) {
            return;
        }
        if (force) {
            ele.classList.add(tag);
            return;
        }
        ele.classList.remove(tag);
    }
}
