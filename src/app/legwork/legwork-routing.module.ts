import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home/home.component';
import { LegworkComponent } from './legwork.component';
import { OrderComponent } from './order/order.component';
import * as provider from './provider';
import * as waiter from './waiter';

const routes: Routes = [{
    path: '',
    component: LegworkComponent,
    children: [
        {
            path: 'provider/apply',
            component: provider.ProfileComponent
        },
        {
            path: 'provider/order',
            component: provider.OrderComponent
        },
        {
            path: 'provider/service/create',
            component: provider.EditServiceComponent
        },
        {
            path: 'provider/service/waiter/:id',
            component: provider.WaiterComponent
        },
        {
            path: 'provider/service/:id',
            component: provider.EditServiceComponent
        },
        {
            path: 'provider/service',
            component: provider.ServiceComponent
        },
        {
            path: 'provider',
            component: provider.ProfileComponent
        },
        {
            path: 'waiter/apply',
            component: waiter.ProfileComponent
        },
        {
            path: 'waiter/center',
            component: waiter.CenterComponent
        },
        {
            path: 'waiter/order',
            component: waiter.OrderComponent
        },
        {
            path: 'waiter/service/apply',
            component: waiter.ApplyServiceComponent
        },
        {
            path: 'waiter/service',
            component: waiter.ServiceComponent
        },
        {
            path: 'waiter',
            component: waiter.ProfileComponent
        },
        {
            path: 'service/:id',
            component: DetailComponent,
        },
        {
            path: 'order',
            component: OrderComponent,
        },
        {
            path: '',
            component: HomeComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegworkRoutingModule {}

export const legworkRoutingComponents = [
    LegworkComponent, HomeComponent, provider.EditServiceComponent, provider.OrderComponent, provider.ProfileComponent,
    provider.ServiceComponent, waiter.ProfileComponent, waiter.CenterComponent, waiter.OrderComponent, DetailComponent, OrderComponent,
    waiter.ApplyServiceComponent, waiter.ServiceComponent,
    provider.WaiterComponent
];
