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

    @HostBinding('class')
    public itemClass = '';

    public set index(arg: number) {
        if (arg < 0) {
            this.itemClass = 'stack-item-fade-out';
            return;
        }
        if (arg === 0) {
            this.itemClass = 'stack-item-active';
            return;
        }
        if (arg > 3) {
            this.itemClass = 'stack-item-next';
            return;
        }
        this.itemClass = `stack-item-next${arg}`;
    }
}
