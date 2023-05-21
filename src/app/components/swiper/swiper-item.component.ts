import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-swiper-item',
    template: `<div class="swiper-item-body"><ng-content></ng-content></div>`,
    host: {
        '[ngStyle]': 'itemStyle'
    }
})
export class SwiperItemComponent {

    @HostBinding('class.swiper-item-active')
    public active = false;
    public itemStyle = {};

    constructor() { }
}
