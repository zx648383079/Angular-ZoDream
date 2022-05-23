import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateViaAuthGuard } from '../../theme/guards';
import { CartComponent } from './cart/cart.component';
import { CartDialogComponent } from './cart/dialog/cart-dialog.component';
import { CashierComponent } from './cashier/cashier.component';
import { CateringComponent } from './catering.component';
import { GoodsDialogComponent } from './goods/dialog/goods-dialog.component';
import { GoodsComponent } from './goods/goods.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { StoreComponent } from './store/store.component';


const routes: Routes = [
    {
        path: '',
        component: CateringComponent,
        children: [
            {
                path: 'merchant',
                loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule),
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: 'waiter',
                loadChildren: () => import('./waiter/waiter.module').then(m => m.WaiterModule),
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: 'member',
                loadChildren: () => import('./member/member.module').then(m => m.MemberModule),
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: 'cart',
                component: CartComponent,
            },
            {
                path: 'cashier',
                component: CashierComponent,
            },
            {
                path: ':store',
                component: GoodsComponent,
            },
            {
                path: '',
                component: StoreComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CateringRoutingModule {}


export const cateringRoutingComponents = [
    CateringComponent,
    SearchInputComponent,
    GoodsComponent,
    StoreComponent,
    CartComponent,
    CashierComponent,
    GoodsDialogComponent,
    CartDialogComponent,
];
