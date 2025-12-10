import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { toggleClass } from '../../../theme/utils/doc';

@Directive({
    standalone: false,
    selector: '[appDropdown]'
})
export class DropdownDirective {
    private elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    @HostListener('click', [])
    public onClick() {
        const element = this.elementRef.nativeElement;
        if (!element) {
            return;
        }
        toggleClass(element.parentElement, '--with-open');
    }
}
