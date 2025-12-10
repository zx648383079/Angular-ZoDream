import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { SwipeControlComponent } from './swipe-control.component';

@Component({
    standalone: false,
    selector: 'app-swipe-list-control',
    template: `<div class="swipe-list-control">
        <ng-content />
    </div>`,
    styleUrls: []
})
export class SwipeListControlComponent implements AfterContentInit {
    public readonly items = contentChildren(SwipeControlComponent);


    ngAfterContentInit(): void {
        this.items().changes.subscribe(() => {
            for (let i = 0; i < this.items().length; i++) {
                this.items().at(i).parent = this;
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