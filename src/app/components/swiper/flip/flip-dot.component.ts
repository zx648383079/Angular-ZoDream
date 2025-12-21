import { Component, ViewEncapsulation, effect, input, model, signal } from '@angular/core';
import { rangeStep } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-flip-dot',
    encapsulation: ViewEncapsulation.None,
    template: `
    @for (item of items(); track $index) {
        <span [class.active]="value() == item" (click)="tapDot(item)"></span>
    }
    `,
   styleUrls: ['./flip-dot.component.scss'],
    host: {
        class: 'swiper-flip-dot',
    }
})
export class FlipDotComponent {

    public readonly max = input(0);
    public readonly value = model(0);
    public readonly disabled = input(true);
    public readonly items = signal<number[]>([]);

    constructor() {
        effect(() => {
            this.items.set(rangeStep(0, this.max()));
        });
    }

    public tapDot(i: number) {
        if (this.disabled()) {
            return;
        }
        this.value.set(i);
    }
}
