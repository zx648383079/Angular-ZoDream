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
import { GroupBuyGoodsComponent } from './group-buy/goods/group-buy-goods.component';
import { GroupBuyComponent } from './group-buy/group-buy.component';
import { FreeTrialGoodsComponent } from './free-trial/goods/free-trial-goods.component';
import { FreeTrialComponent } from './free-trial/free-trial.component';
import { BargainGoodsComponent } from './bargain/goods/bargain-goods.component';
import { BargainComponent } from './bargain/bargain.component';
import { BargainLogComponent } from './bargain/log/bargain-log.component';

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
        path: 'group-buy/:id',
        component: GroupBuyGoodsComponent,
    },
    {
        path: 'group-buy',
        component: GroupBuyComponent,
    },
    {
        path: 'trial/:id',
        component: FreeTrialGoodsComponent,
    },
    {
        path: 'trial',
        component: FreeTrialComponent,
    },
    {
        path: 'bargain/:id/:log',
        component: BargainGoodsComponent,
    },
    {
        path: 'bargain',
        component: BargainComponent,
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
    ActivityComponent, AuctionComponent, SeckillComponent, CouponComponent, AuctionGoodsComponent, AuctionLogComponent, PresaleComponent, PresaleGoodsComponent, MixComponent, MixSliderComponent, GroupBuyGoodsComponent, GroupBuyComponent, FreeTrialGoodsComponent,
    FreeTrialComponent, BargainGoodsComponent, BargainComponent,
    BargainLogComponent,
];
