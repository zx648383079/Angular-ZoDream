import { Component, ViewEncapsulation, afterRenderEffect, contentChildren, effect, model } from '@angular/core';
import { StackItemComponent } from './stack-item.component';
import { checkLoopRange } from '../../../theme/utils';
import { SwiperEvent } from '../model';

@Component({
    standalone: false,
    selector: 'app-stack-container',
    encapsulation: ViewEncapsulation.None,
    template: `
    <div class="stack-container">
        <ng-content />
    </div>`,
    styleUrls: ['./stack-container.component.scss']
})
export class StackContainerComponent implements SwiperEvent {

    private readonly items = contentChildren(StackItemComponent);
    public readonly index = model(-1);
    private isUpdated = false;

    constructor() {
        let index = -1;
        effect(() => {
            const current = this.index();
            this.navigateTo(current, index);
            index = current;
        });
        effect(() => {
            this.items();
            this.lazyRefresh();
        });
        afterRenderEffect(() => this.lazyRefresh());
    }

    private lazyRefresh() {
        if (this.isUpdated) {
            return;
        }
        this.isUpdated = true;
        setTimeout(() => {
            if (this.isUpdated) {
                this.isUpdated = false;
                this.refresh();
            }
        }, 10);
    }

    public get backable() {
        return this.index() > 0;
    }

    public get nextable() {
        return this.index() < this.items().length - 1;
    }

    public back() {
        if (!this.backable) {
            return;
        }
        this.navigate(this.index() - 1);
    }

    public next() {
        if (!this.nextable) {
            return;
        }
        this.navigate(this.index() + 1);
    }

    public navigate(index: number) {
        this.index.set(index);
    }

    private refresh() {
        this.navigate(Math.max(0, this.index()));
    }

    private navigateTo(to: number, from: number) {
        const max = this.items().length - 1;
        to = checkLoopRange(to, max);
        // if (to === from) {
        //     return;
        // }
        for (let i = 0; i < this.items().length; i++) {
            this.items().at(i).index = i - to;
        }
    }
}
