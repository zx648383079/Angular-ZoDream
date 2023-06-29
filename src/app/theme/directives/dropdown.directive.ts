import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

    constructor(
        private elementRef: ElementRef<HTMLDivElement>
    ) { }

    @HostListener('click', [])
    private onClick() {
        const element = this.elementRef.nativeElement;
        if (!element) {
            return;
        }
        this.toggleClass(element.parentElement, 'dropdown-open');
    }

    private toggleClass(ele: HTMLElement, tag: string, force?: boolean) {
        if (force === void 0) {
            force = !ele.classList.contains(tag);
        }
        if (force) {
            ele.classList.add(tag);
            return;
        }
        ele.classList.remove(tag);
    }
}
