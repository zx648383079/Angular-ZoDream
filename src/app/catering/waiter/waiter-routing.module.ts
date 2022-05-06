import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogComponent } from './log/log.component';
import { WaiterMenuComponent } from './menu/waiter-menu.component';
import { OrderComponent } from './order/order.component';
import { WaiterComponent } from './waiter.component';


const routes: Routes = [
    {
        path: 'order/:status',
        component: OrderComponent
    },
    {
        path: 'order',
        component: OrderComponent
    },
    {
        path: 'log',
        component: LogComponent
    },
    {
        path: '',
        component: WaiterComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaiterRoutingModule {}


export const waiterRoutingComponents = [
    WaiterComponent, OrderComponent, LogComponent, WaiterMenuComponent,
];
