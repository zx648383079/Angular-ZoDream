import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop.component';
import { CanActivateViaAuthGuard } from '../../theme/guards';

const routes: Routes = [
    {
        canActivate: [CanActivateViaAuthGuard],
        path: 'merchant', loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule) 
    },
    {
        path: '',
        component: ShopComponent,
        children: [
            { path: 'market', loadChildren: () => import('./market/market.module').then(m => m.MarketModule) },
            { path: 'member', loadChildren: () => import('./member/member.module').then(m => m.MemberModule) },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'market'
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
