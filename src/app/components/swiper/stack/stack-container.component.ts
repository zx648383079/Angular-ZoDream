import { AfterContentInit, AfterViewInit, Component, ContentChildren, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { StackItemComponent } from './stack-item.component';
import { checkLoopRange } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-stack-container',
    encapsulation: ViewEncapsulation.None,
    template: `
    <div class="stack-container">
        <ng-content></ng-content>
    </div>`,
    styleUrls: ['./stack-container.component.scss']
})
export class StackContainerComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit, OnDestroy {

    @ContentChildren(StackItemComponent) 
    private items: QueryList<StackItemComponent>;
    @Input() public index = -1;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        
    }

    ngAfterViewInit(): void {
        
    }

    ngAfterContentInit(): void {
        setTimeout(() => {
            this.navigate(Math.max(0, this.index));
        }, 10);
    }

    ngOnDestroy(): void {
        
    }

    public get backable() {
        return this.index > 0;
    }

    public get nextable() {
        return this.index < this.items.length - 1;
    }

    public back() {
        if (!this.backable) {
            return;
        }
        this.navigate(this.index - 1);
    }

    public next() {
        if (!this.nextable) {
            return;
        }
        this.navigate(this.index + 1);
    }

    public navigate(index: number) {
        index = checkLoopRange(index, this.items.length - 1);
        if (this.index === index) {
            return;
        }
        const lastIndex = this.index;
        this.index = index;
        if (lastIndex >= 0) {
            const last = this.items.get(lastIndex);
            last.active = false;
            last.fadeOut = true;
        }
        const current = this.items.get(this.index);
        current.fadeOut = false;
        current.active = true;
    }
}
