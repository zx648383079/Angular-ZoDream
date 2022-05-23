import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    ShopComponent
} from './shop.component';
import {
    AdComponent
} from './ad/ad.component';
import {
    EditAdComponent
} from './ad/edit/edit.component';
import {
    PositionComponent
} from './ad/position/position.component';
import {
    EditPositionComponent
} from './ad/edit-position/edit-position.component';
import {
    ArticleComponent
} from './article/article.component';
import {
    EditArticleComponent
} from './article/edit/edit.component';
import {
    CategoryComponent
} from './article/category/category.component';
import {
    EditCategoryComponent
} from './article/edit-category/edit-category.component';
import {
    PaymentComponent
} from './payment/payment.component';
import {
    EditPaymentComponent
} from './payment/edit/edit.component';
import {
    ShippingComponent
} from './shipping/shipping.component';
import {
    EditShippingComponent
} from './shipping/edit/edit.component';
import {
    RegionComponent
} from './region/region.component';
import {
    PaymentOptionComponent
} from './payment/option/option.component';

const routes: Routes = [{
        path: '',
        component: ShopComponent
    },
    {
        path: 'ad/edit/:id',
        component: EditAdComponent
    },
    {
        path: 'ad/create',
        component: EditAdComponent
    },
    {
        path: 'ad/position/edit/:id',
        component: EditPositionComponent
    },
    {
        path: 'ad/position/create',
        component: EditPositionComponent
    },
    {
        path: 'ad/position',
        component: PositionComponent
    },
    {
        path: 'ad',
        component: AdComponent
    },
    {
        path: 'region',
        component: RegionComponent
    },
    {
        path: 'article/edit/:id',
        component: EditArticleComponent
    },
    {
        path: 'article/create',
        component: EditArticleComponent
    },
    {
        path: 'article/category/edit/:id',
        component: EditCategoryComponent
    },
    {
        path: 'article/category/create',
        component: EditCategoryComponent
    },
    {
        path: 'article/category',
        component: CategoryComponent
    },
    {
        path: 'article',
        component: ArticleComponent
    },
    {
        path: 'payment/edit/:id',
        component: EditPaymentComponent
    },
    {
        path: 'payment/create',
        component: EditPaymentComponent
    },
    {
        path: 'payment/option',
        component: PaymentOptionComponent
    },
    {
        path: 'payment',
        component: PaymentComponent
    },
    {
        path: 'shipping/edit/:id',
        component: EditShippingComponent
    },
    {
        path: 'shipping/create',
        component: EditShippingComponent
    },
    {
        path: 'shipping',
        component: ShippingComponent
    },
    {
        path: 'goods',
        loadChildren: () => import('./goods/goods.module').then(m => m.GoodsModule)
    },
    {
        path: 'activity',
        loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule)
    },
    {
        path: 'order',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
    },
    {
        path: 'warehouse',
        loadChildren: () => import('./warehouse/warehouse.module').then(m => m.WarehouseModule)
    },
    {
        path: 'plugin',
        loadChildren: () => import('./plugin/plugin.module').then(m => m.PluginModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopBackendRoutingModule {}

export const shopBackendRoutedComponents = [
    ShopComponent,
    AdComponent,
    EditAdComponent,
    EditPositionComponent,
    PositionComponent,
    EditArticleComponent,
    EditCategoryComponent,
    CategoryComponent,
    ArticleComponent,
    EditPaymentComponent,
    PaymentOptionComponent,
    PaymentComponent,
    EditShippingComponent,
    ShippingComponent,
    RegionComponent,
];