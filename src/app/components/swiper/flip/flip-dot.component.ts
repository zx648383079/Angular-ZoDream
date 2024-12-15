import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { rangeStep } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-flip-dot',
    encapsulation: ViewEncapsulation.None,
    template: `
    <ng-container *ngFor="let item of items">
        <span [ngClass]="{active: value == item}" (click)="tapDot(item)"></span>
    </ng-container>
    `,
   styleUrls: ['./flip-dot.component.scss'],
    host: {
        class: 'swiper-flip-dot',
    }
})
export class FlipDotComponent implements OnChanges {

    @Input() public max = 0;
    @Input() public value = 0;
    @Input() public disabled = true;
    public items: number[] = [];
    @Output() public valueChange = new EventEmitter<number>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.max) {
            this.items = rangeStep(0, this.max);
        }
    }

    public tapDot(i: number) {
        if (this.disabled) {
            return;
        }
        this.valueChange.emit(this.value = i);
    }
}
