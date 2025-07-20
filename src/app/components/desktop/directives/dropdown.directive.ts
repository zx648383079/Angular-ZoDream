import { Directive, ElementRef, HostListener } from '@angular/core';
import { toggleClass } from '../../../theme/utils/doc';

@Directive({
    standalone: false,
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
        toggleClass(element.parentElement, '--with-open');
    }
}
