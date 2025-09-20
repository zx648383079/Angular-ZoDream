import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-stack-item',
    template: `<ng-content></ng-content>`,
    styles: [''],
    host: {
        class: 'stack-item',
    }
})
export class StackItemComponent {

    @HostBinding('class.stack-item-active')
    public active = false;

    @HostBinding('class.stack-item-fade-out')
    public fadeOut = false;
}
