import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FlipItemComponent } from './flip-item.component';

@Component({
    selector: 'app-flip-container',
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flip-container" [ngStyle]="flipStyle">
        <ng-content></ng-content>
    </div>
    `,
    styleUrls: ['./flip-container.component.scss'],
})
export class FlipContainerComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit, OnDestroy {

    @ContentChildren(FlipItemComponent) 
    public items: QueryList<FlipItemComponent>;
    @Input() public index = 0;
    public itemCount = 0;
    private resize$: ResizeObserver;
    public itemWidth = 0;
    private historyItems: number[] = [0];
    @Output() public indexChange = new EventEmitter<number>();

    constructor(
        private elementRef: ElementRef<HTMLDivElement>,
    ) { }

    public get flipStyle() {
        if (this.itemWidth <= 0) {
            return {};
        }
        return {
            transform: 'translateX(-' + this.index * this.itemWidth + 'px)', 
            width: this.itemWidth * this.itemCount + 'px'
        };
    };

    ngOnInit() {
        this.resize$ = new ResizeObserver(entries => {
            for (const item of entries) {
                if (item.contentRect.width === this.itemWidth) {
                    return;
                }
                this.itemWidth = item.contentRect.width;
                this.updateWidth();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.index) {
            this.navigate(changes.index.currentValue);
        }
    }

    ngAfterViewInit(): void {
        const box = this.elementRef.nativeElement;
        this.resize$.observe(box);
    }

    ngAfterContentInit(): void {
        this.itemCount = this.items.length;
        this.items.changes.subscribe(() => {
            this.itemCount = this.items.length;
        });
    }

    ngOnDestroy(): void {
        this.resize$.disconnect();
    }

    private get lastIndex() {
        return this.historyItems[this.historyItems.length - 1];
    }

    public navigate(index: number) {
        if (index >= this.itemCount) {
            return;
        }
        const last = this.lastIndex;
        if (last === index) {
            return;
        }
        const i = this.historyItems.indexOf(index);
        if (i >= 0) {
            this.historyItems.splice(i + 1);
        } else {
            this.historyItems.push(index);
        }
        this.animateFlip(last, index, i >= 0);
    }

    public back() {
        if (this.historyItems.length < 2) {
            return;
        }
        const last = this.historyItems.pop();
        this.animateFlip(last, this.lastIndex, true);
    }

    private animateFlip(from: number, to: number, isBack = false) {
        this.indexChange.emit(this.index = to);
        const item = this.items.get(to);
        if (item) {
            item.backable = this.historyItems.length > 1;
            item.parent = this;
        }
    }

    private updateWidth() {
        if (this.itemCount < 1 || this.itemWidth <= 0) {
            return;
        }
        this.items.forEach(item => {
            item.boxStyle = {
                width: this.itemWidth + 'px'
            };
        });
    }

}
