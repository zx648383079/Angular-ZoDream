import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AccountCenterComponent } from './account/center/account-center.component';
import { AddressComponent } from './address/address.component';
import { BonusComponent } from './bonus/bonus.component';
import { CollectComponent } from './collect/collect.component';
import { CouponComponent } from './coupon/coupon.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';

import { MemberComponent } from './member.component';
import { MessageComponent } from './message/message.component';
import { OrderDetailComponent } from './order/detail/order-detail.component';
import { OrderComponent } from './order/order.component';
import { PriceProtectComponent } from './price-protect/price-protect.component';
import { ProfileComponent } from './profile/profile.component';
import { RefundComponent } from './refund/refund.component';

const routes: Routes = [
    {
        path: '',
        component: MemberComponent,
        children: [
            {
                path: 'account/center',
                component: AccountCenterComponent,
            },
            {
                path: 'account',
                component: AccountComponent,
            },
            {
                path: 'address',
                component: AddressComponent,
            },
            {
                path: 'bonus',
                component: BonusComponent,
            },
            {
                path: 'collect',
                component: CollectComponent,
            },
            {
                path: 'coupon',
                component: CouponComponent,
            },
            {
                path: 'history',
                component: HistoryComponent,
            },
            {
                path: 'message',
                component: MessageComponent,
            },
            {
                path: 'order/:id',
                component: OrderDetailComponent,
            },
            {
                path: 'order',
                component: OrderComponent,
            },
            {
                path: 'price_protect',
                component: PriceProtectComponent,
            },
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'refund',
                component: RefundComponent,
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }

export const memberRoutingComponents = [
    MemberComponent, HomeComponent, AccountCenterComponent, AccountComponent, AddressComponent,
    BonusComponent, CollectComponent, CouponComponent, HistoryComponent, MessageComponent,
    OrderDetailComponent, OrderComponent, PriceProtectComponent, ProfileComponent, RefundComponent,
];
