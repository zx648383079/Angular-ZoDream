import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { HomeComponent } from './home/home.component';
import { StoreSettingComponent } from './setting/store-setting.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantComponent,
        children: [
            {
                path: 'finance',
                loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule)
            },
            {
                path: 'product',
                loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
            },
            {
                path: 'marketing',
                loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingModule)
            },
            {
                path: 'service',
                loadChildren: () => import('./after-sales/after-sales.module').then(m => m.AfterSalesModule)
            },
            {
                path: 'order',
                loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
            },
            {
                path: 'setting',
                component: StoreSettingComponent
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }

export const merchantRoutingComponents = [
    MerchantComponent, HomeComponent, StoreSettingComponent
];
