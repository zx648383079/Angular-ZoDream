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
    ActivityComponent, AuctionComponent, SeckillComponent, CouponComponent, AuctionGoodsComponent
];
