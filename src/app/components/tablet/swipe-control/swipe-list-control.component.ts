import { Component, contentChildren, effect } from '@angular/core';
import { SwipeControlComponent } from './swipe-control.component';

@Component({
    standalone: false,
    selector: 'app-swipe-list-control',
    template: `<div class="swipe-list-control">
        <ng-content />
    </div>`,
    styleUrls: []
})
export class SwipeListControlComponent {
    public readonly items = contentChildren(SwipeControlComponent);

    constructor() {
        effect(() => {
            const items = this.items();
            for (const item of this.items()) {
                item.parent = this;
            }
        });
    }

    public siblings(exclude: SwipeControlComponent): SwipeControlComponent[] {
        const items = [];
        for (let i = 0; i < this.items().length; i++) {
            const item = this.items().at(i);
            if (item === exclude) {
                continue;
            }
            items.push(item);
        }
        return items;
    }
}