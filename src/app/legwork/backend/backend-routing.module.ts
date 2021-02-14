import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { LegworkBackendComponent } from './legwork-backend.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderComponent } from './order/order.component';
import { ProviderComponent } from './provider/provider.component';
import { ServiceComponent } from './service/service.component';
import { WaiterComponent } from './waiter/waiter.component';

const routes: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
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
        path: 'provider',
        component: ProviderComponent,
    },
    {
        path: 'service',
        component: ServiceComponent,
    },
    {
        path: 'waiter',
        component: WaiterComponent,
    },
    {
        path: '',
        component: LegworkBackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegworkBackendRoutingModule {}

export const legworkBackendRoutingComponents = [
    LegworkBackendComponent, CategoryComponent, OrderComponent, OrderDetailComponent, ProviderComponent, WaiterComponent, ServiceComponent
];
