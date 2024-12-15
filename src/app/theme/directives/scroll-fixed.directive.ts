import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { scrollTop } from '../utils/doc';

@Directive({
    standalone: false,
    selector: '[appScrollFixed]'
})
export class ScrollFixedDirective implements OnInit {

    @Input() public appScrollFixed: string;
    @Input() public whenScrollTop = true;

    private lastOffset = 0;
    private lastScrollTop = 0;

    constructor(
        private elementRef: ElementRef<HTMLDivElement>
    ) { }

    ngOnInit(): void {
        this.onResize();
    }

    @HostListener('window:resize', [])
    private onResize() {
        const target = this.elementRef.nativeElement;
        if (!target) {
            return;
        }
        if (this.appScrollFixed && target.classList.contains(this.appScrollFixed)) {
            return;
        }
        this.lastOffset = target.getBoundingClientRect().top + scrollTop();
    }

    @HostListener('window:scroll', [])
    public onScroll(): void {
        const oldTop = this.lastScrollTop;
        const sT = this.lastScrollTop = scrollTop();
        if (sT <= this.lastOffset) {
            this.toggleClass(this.appScrollFixed, false);
            return;
        }
        if (this.whenScrollTop) {
            this.toggleClass(this.appScrollFixed, oldTop > sT);
            return;
        }
        this.toggleClass(this.appScrollFixed, true);
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
