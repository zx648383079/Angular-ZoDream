import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsComponent } from './goods/goods.component';
import { MerchantMenuComponent } from './menu/merchant-menu.component';
import { MerchantComponent } from './merchant.component';
import { OrderComponent } from './order/order.component';
import { RecipeDialogComponent } from './recipe/dialog/recipe-dialog.component';
import { RecipeComponent } from './recipe/recipe.component';
import { StaffComponent } from './staff/staff.component';
import { StockDialogComponent } from './stock/dialog/stock-dialog.component';
import { PurchaseOrderComponent } from './stock/order/purchase-order.component';
import { StockComponent } from './stock/stock.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
    {
        path: 'order',
        component: OrderComponent
    },
    {
        path: 'goods',
        component: GoodsComponent
    },
    {
        path: 'stock',
        component: StockComponent
    },
    {
        path: 'stock/order',
        component: PurchaseOrderComponent
    },
    {
        path: 'staff',
        component: StaffComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'recipe',
        component: RecipeComponent
    },
    {
        path: '',
        component: MerchantComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MerchantRoutingModule {}


export const merchantRoutingComponents = [
    MerchantComponent, OrderComponent, GoodsComponent, StockComponent, StaffComponent, UsersComponent, MerchantMenuComponent, PurchaseOrderComponent, RecipeComponent,
    RecipeDialogComponent, StockDialogComponent
];
