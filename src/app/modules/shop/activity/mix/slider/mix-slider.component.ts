import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, effect, inject, input, viewChildren } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-mix-slider',
    templateUrl: './mix-slider.component.html',
    styleUrls: ['./mix-slider.component.scss']
})
export class MixSliderComponent implements OnInit, AfterViewInit {
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);


    public readonly viewItems = viewChildren<ElementRef<HTMLLIElement>>('itemView');

    public readonly items = input<any[]>([]);

    public index = 0;
    private itemWidth = 0;
    private itemHeight = 0;
    private boxWidth = 0;

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
            width: (this.itemWidth * this.items().length) + 'px',
            left: (- this.index * this.itemWidth) + 'px',
        }
    }

    constructor() {
        effect(() => {
            this.items();
            this.reset();
        });
    }

    ngOnInit() {
        this.renderer.listen(window, 'resize', () => {
            this.refreshSize();
        });
    }

    ngAfterViewInit() {
        this.refreshSize();
        const item = this.viewItems().at(0);
        if (!item || !item.nativeElement) {
            return;
        }
        const bound = item.nativeElement.getBoundingClientRect();
        this.itemWidth = bound.width + 48;
        this.itemHeight = bound.height;
    }

    public tapPrevious() {
        if (this.index < 1) {
            this.index = this.items().length - 1;
        } else {
            this.index --;
        }
    }

    public tapNext() {
        if (this.index >= this.items().length - 1) {
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
