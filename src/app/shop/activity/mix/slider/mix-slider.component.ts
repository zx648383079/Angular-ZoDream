import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-mix-slider',
  templateUrl: './mix-slider.component.html',
  styleUrls: ['./mix-slider.component.scss']
})
export class MixSliderComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChildren('itemView')
    public viewItems: QueryList<ElementRef<HTMLLIElement>>;

    @Input() public items: any[] = [];

    public index = 0;
    private itemWidth = 0;
    private itemHeight = 0;
    private boxWidth = 0;

    constructor(
        private elementRef: ElementRef<HTMLDivElement>,
        private renderer: Renderer2,
    ) { }

    public get boxStyle() {
        if (this.itemHeight < 1) {
            return {};
        }
        return {
            height: this.itemHeight + 'px',
        };
    }

    public get scrollStyle() {
        if (this.itemHeight < 1) {
            return {};
        }
        return {
            width: (this.itemWidth * this.items.length) + 'px',
            left: (- this.index * this.itemWidth) + 'px',
        }
    }

    ngOnInit() {
        this.renderer.listen(window, 'resize', () => {
            this.refreshSize();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items) {
            this.reset();
        }
    }

    ngAfterViewInit() {
        this.refreshSize();
        const item = this.viewItems.get(0);
        if (!item || !item.nativeElement) {
            return;
        }
        const bound = item.nativeElement.getBoundingClientRect();
        this.itemWidth = bound.width + 48;
        this.itemHeight = bound.height;
    }

    public tapPrevious() {
        if (this.index < 1) {
            this.index = this.items.length - 1;
        } else {
            this.index --;
        }
    }

    public tapNext() {
        if (this.index >= this.items.length - 1) {
            this.index = 0;
        } else {
            this.index ++;
        }
    }

    public reset() {
        this.index = 0;
    }

    private refreshSize() {
        this.boxWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
    }

}
