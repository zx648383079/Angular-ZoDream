import { Component, signal, ViewEncapsulation } from '@angular/core';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-stack-item',
    template: `<ng-content />`,
    styles: [''],
    host: {
        class: 'stack-item',
        '[class]': 'itemClass()'
    }
})
export class StackItemComponent {

    public readonly itemClass = signal('');

    public set index(arg: number) {
        if (arg < 0) {
            this.itemClass.set('stack-item-fade-out');
            return;
        }
        if (arg === 0) {
            this.itemClass.set('stack-item-active');
            return;
        }
        if (arg > 3) {
            this.itemClass.set('stack-item-next');
            return;
        }
        this.itemClass.set(`stack-item-next${arg}`);
    }
}
