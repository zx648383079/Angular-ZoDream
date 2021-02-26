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
import {
    EditAuctionComponent
} from './auction/edit/edit.component';
import {
    EditBargainComponent
} from './bargain/edit/edit.component';
import {
    BargainComponent
} from './bargain/bargain.component';
import {
    EditCashBackComponent
} from './cash-back/edit/edit.component';
import {
    CashBackComponent
} from './cash-back/cash-back.component';
import {
    EditCouponComponent
} from './coupon/edit/edit.component';
import {
    CouponComponent
} from './coupon/coupon.component';
import {
    EditDiscountComponent
} from './discount/edit/edit.component';
import {
    DiscountComponent
} from './discount/discount.component';
import {
    EditFreeTrialComponent
} from './free-trial/edit/edit.component';
import {
    FreeTrialComponent
} from './free-trial/free-trial.component';
import {
    EditGroupBuyComponent
} from './group-buy/edit/edit.component';
import {
    GroupBuyComponent
} from './group-buy/group-buy.component';
import {
    EditLotteryComponent
} from './lottery/edit/edit.component';
import {
    LotteryComponent
} from './lottery/lottery.component';
import {
    EditMixComponent
} from './mix/edit/edit.component';
import {
    MixComponent
} from './mix/mix.component';
import {
    EditPresaleComponent
} from './presale/edit/edit.component';
import {
    PresaleComponent
} from './presale/presale.component';
import {
    EditSeckillComponent
} from './seckill/edit/edit.component';
import {
    SeckillComponent
} from './seckill/seckill.component';
import { SeckillGoodsComponent } from './seckill/goods/seckill-goods.component';
import { TimeComponent } from './seckill/time/time.component';

const routes: Routes = [{
        path: 'auction/create',
        component: EditAuctionComponent,
    },
    {
        path: 'auction/edit/:id',
        component: EditAuctionComponent,
    },
    {
        path: 'auction',
        component: AuctionComponent,
    },
    {
        path: 'bargain/create',
        component: EditBargainComponent,
    },
    {
        path: 'bargain/edit/:id',
        component: EditBargainComponent,
    },
    {
        path: 'bargain',
        component: BargainComponent,
    },
    {
        path: 'cash-back/create',
        component: EditCashBackComponent,
    },
    {
        path: 'cash-back/edit/:id',
        component: EditCashBackComponent,
    },
    {
        path: 'cash-back',
        component: CashBackComponent,
    },
    {
        path: 'coupon/create',
        component: EditCouponComponent,
    },
    {
        path: 'coupon/edit/:id',
        component: EditCouponComponent,
    },
    {
        path: 'coupon',
        component: CouponComponent,
    },
    {
        path: 'discount/create',
        component: EditDiscountComponent,
    },
    {
        path: 'discount/edit/:id',
        component: EditDiscountComponent,
    },
    {
        path: 'discount',
        component: DiscountComponent,
    },
    {
        path: 'free-trial/create',
        component: EditFreeTrialComponent,
    },
    {
        path: 'free-trial/edit/:id',
        component: EditFreeTrialComponent,
    },
    {
        path: 'free-trial',
        component: FreeTrialComponent,
    },
    {
        path: 'group-buy/create',
        component: EditGroupBuyComponent,
    },
    {
        path: 'group-buy/edit/:id',
        component: EditGroupBuyComponent,
    },
    {
        path: 'group-buy',
        component: GroupBuyComponent,
    },
    {
        path: 'lottery/create',
        component: EditLotteryComponent,
    },
    {
        path: 'lottery/edit/:id',
        component: EditLotteryComponent,
    },
    {
        path: 'lottery',
        component: LotteryComponent,
    },
    {
        path: 'mix/create',
        component: EditMixComponent,
    },
    {
        path: 'mix/edit/:id',
        component: EditMixComponent,
    },
    {
        path: 'mix',
        component: MixComponent,
    },
    {
        path: 'presale/create',
        component: EditPresaleComponent,
    },
    {
        path: 'presale/edit/:id',
        component: EditPresaleComponent,
    },
    {
        path: 'presale',
        component: PresaleComponent,
    },
    {
        path: 'seckill/goods/:activity/:time',
        component: SeckillGoodsComponent,
    },
    {
        path: 'seckill/goods/:activity',
        component: TimeComponent,
    },
    {
        path: 'seckill/time',
        component: TimeComponent,
    },
    {
        path: 'seckill/create',
        component: EditSeckillComponent,
    },
    {
        path: 'seckill/edit/:id',
        component: EditSeckillComponent,
    },
    {
        path: 'seckill',
        component: SeckillComponent,
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
    ActivityComponent, AuctionComponent, EditAuctionComponent, BargainComponent, EditBargainComponent, CashBackComponent,
    EditCashBackComponent, CouponComponent, EditCouponComponent, DiscountComponent, EditDiscountComponent,
    FreeTrialComponent, EditFreeTrialComponent,
    GroupBuyComponent,
    EditGroupBuyComponent,
    LotteryComponent,
    EditLotteryComponent,
    MixComponent,
    EditMixComponent,
    PresaleComponent,
    EditPresaleComponent,
    SeckillComponent,
    EditSeckillComponent,
    SeckillGoodsComponent,
    TimeComponent
];
