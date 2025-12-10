import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-swiper-item',
    template: `<div class="swiper-item-body"><ng-content /></div>`,
})
export class SwiperItemComponent {

    @HostBinding('class.swiper-item-active')
    public active = false;
    @HostBinding('style')
    public itemStyle = {};
}
