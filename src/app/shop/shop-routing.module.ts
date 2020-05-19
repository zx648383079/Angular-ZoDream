import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      { path: 'market', loadChildren: () => import('./market/market.module').then(m => m.MarketModule) },
      { path: 'member', loadChildren: () => import('./member/member.module').then(m => m.MemberModule) },
      {
        path: '',
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
