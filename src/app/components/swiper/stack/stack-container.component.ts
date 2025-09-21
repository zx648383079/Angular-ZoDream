import { AfterContentInit, AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, output, QueryList, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { StackItemComponent } from './stack-item.component';
import { checkLoopRange } from '../../../theme/utils';
import { SwiperEvent } from '../model';

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
export class StackContainerComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit, OnDestroy, SwiperEvent {

    @ContentChildren(StackItemComponent) 
    private items: QueryList<StackItemComponent>;
    @Input() public index = -1;
    @Output() public indexChange = new EventEmitter<number>();

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.index) {
            this.navigateTo(changes.index.currentValue, changes.index.previousValue);
        }
    }

    ngAfterViewInit(): void {
        
    }

    ngAfterContentInit(): void {
        let isUpdated = false;
        const lazyFn = () => {
            if (isUpdated) {
                return;
            }
            isUpdated = true;
            setTimeout(() => {
                if (isUpdated) {
                    isUpdated = false;
                    this.refresh();
                }
            }, 10);
        };
        this.items.changes.subscribe(() => {
            lazyFn();
        });
        lazyFn();
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
        this.navigateTo(index, this.index);
    }

    private refresh() {
        this.navigate(Math.max(0, this.index));
    }

    private navigateTo(to: number, from: number) {
        const max = this.items.length - 1;
        to = checkLoopRange(to, max);
        // if (to === from) {
        //     return;
        // }
        for (let i = 0; i < this.items.length; i++) {
            this.items.get(i).index = i - to;
        }
        this.index = to;
        this.indexChange.emit(to);
    }
}
