import { Component, OnChanges, SimpleChanges, ViewEncapsulation, input, output } from '@angular/core';
import { rangeStep } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-flip-dot',
    encapsulation: ViewEncapsulation.None,
    template: `
    @for (item of items; track $index) {
        <span [ngClass]="{active: value() == item}" (click)="tapDot(item)"></span>
    }
    `,
   styleUrls: ['./flip-dot.component.scss'],
    host: {
        class: 'swiper-flip-dot',
    }
})
export class FlipDotComponent implements OnChanges {

    public readonly max = input(0);
    public readonly value = input(0);
    public readonly disabled = input(true);
    public items: number[] = [];
    public readonly valueChange = output<number>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.max) {
            this.items = rangeStep(0, this.max());
        }
    }

    public tapDot(i: number) {
        if (this.disabled()) {
            return;
        }
        this.valueChange.emit(this.value = i);
    }
}
