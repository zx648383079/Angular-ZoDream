import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    NgModule
} from '@angular/core';
import {
    ActivityComponent
} from './activity.component';
import {
    AuctionComponent
} from './auction/auction.component';
import { SeckillComponent } from './seckill/seckill.component';
import { CouponComponent } from './coupon/coupon.component';
import { AuctionGoodsComponent } from './auction/goods/auction-goods.component';
import { AuctionLogComponent } from './auction/log/auction-log.component';
import { PresaleComponent } from './presale/presale.component';
import { PresaleGoodsComponent } from './presale/goods/presale-goods.component';
import { MixComponent } from './mix/mix.component';
import { MixSliderComponent } from './mix/slider/mix-slider.component';

const routes: Routes = [
    {
        path: 'auction/:id',
        component: AuctionGoodsComponent,
    },
    {
        path: 'auction',
        component: AuctionComponent,
    },
    {
        path: 'seckill',
        component: SeckillComponent,
    },
    {
        path: 'presale/:id',
        component: PresaleGoodsComponent,
    },
    {
        path: 'presale',
        component: PresaleComponent,
    },
    {
        path: 'mix',
        component: MixComponent,
    },
    {
        path: 'coupon',
        component: CouponComponent,
    },
    {
        path: '',
        component: ActivityComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityRoutingModule {}

export const activityRoutedComponents = [
    ActivityComponent, AuctionComponent, SeckillComponent, CouponComponent, AuctionGoodsComponent, AuctionLogComponent, PresaleComponent, PresaleGoodsComponent, MixComponent, MixSliderComponent,
];
