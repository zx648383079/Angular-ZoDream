import { Component, ElementRef, 
    ViewEncapsulation, inject, contentChildren, model, effect, 
    computed,
    signal,
    DestroyRef,
    afterNextRender} from '@angular/core';
import { FlipItemComponent } from './flip-item.component';
import { SwiperEvent } from '../model';

@Component({
    standalone: false,
    selector: 'app-flip-container',
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flip-container" [style]="flipStyle()">
        <ng-content />
    </div>
    `,
    styleUrls: ['./flip-container.component.scss'],
})
export class FlipContainerComponent implements SwiperEvent {
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
    private readonly destroyRef = inject(DestroyRef);

    public readonly items = contentChildren(FlipItemComponent);
    public readonly index = model(0);
    public itemCount = 0;
    private resize$: ResizeObserver;
    public readonly itemWidth = signal(0);
    private historyItems: number[] = [0];


    public readonly flipStyle = computed(() => {
        const width = this.itemWidth();
        if (width <= 0) {
            return {};
        }
        return {
            transform: 'translateX(-' + this.index() * width + 'px)', 
            width: width * this.itemCount + 'px'
        };
    });

    constructor() {
        effect(() => {
            this.navigate(this.index());
        });
        effect(() => {
            this.itemCount = this.items().length;
        });
        this.resize$ = new ResizeObserver(entries => {
            for (const item of entries) {
                if (item.contentRect.width === this.itemWidth()) {
                    return;
                }
                this.itemWidth.set(item.contentRect.width);
                this.updateWidth();
            }
        });
        afterNextRender({
            write: () => {
                const box = this.elementRef.nativeElement;
                this.resize$.observe(box);
            }
        });
        afterRender(() => {
            this.itemCount = this.items().length;
        });
        this.destroyRef.onDestroy(() => {
            this.resize$.disconnect();
        })
    }

    public get backable(): boolean {
        return this.historyItems.length > 1;
    }
    public get nextable(): boolean {
        return this.lastIndex < this.itemCount - 1;
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

    public next(): void {
        if (!this.nextable) {
            return;
        }
        this.navigate(this.index() + 1);
    }

    public back() {
        if (!this.backable) {
            return;
        }
        const last = this.historyItems.pop();
        this.animateFlip(last, this.lastIndex, true);
    }

    private animateFlip(from: number, to: number, isBack = false) {
        this.index.set(to);
        const item = this.items().at(to);
        if (item) {
            item.backable.set(this.historyItems.length > 1);
            item.parent = this;
        }
    }

    private updateWidth() {
        const width = this.itemWidth();
        if (this.itemCount < 1 || width <= 0) {
            return;
        }
        this.items().forEach(item => {
            item.boxStyle.set({
                width: width + 'px'
            });
        });
    }

}
function afterRender(arg0: () => void) {
    throw new Error('Function not implemented.');
}

