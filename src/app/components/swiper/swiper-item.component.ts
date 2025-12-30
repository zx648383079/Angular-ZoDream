import { Component, signal, ViewEncapsulation } from '@angular/core';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-swiper-item',
    template: `<div class="swiper-item-body"><ng-content /></div>`,
    host: {
        '[class.swiper-item-active]': 'active()',
        '[style]': 'itemStyle()'
    }
})
export class SwiperItemComponent {

    public readonly active = signal(false);
    public readonly itemStyle = signal<any>({});
}
