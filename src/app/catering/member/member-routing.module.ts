import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { MemberComponent } from './member.component';
import { OrderComponent } from './order/order.component';


const routes: Routes = [
    {
        path: 'address',
        component: AddressComponent,
    },
    {
        path: 'order',
        component: OrderComponent,
    },
    {
        path: '',
        component: MemberComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemberRoutingModule {}


export const memberRoutingComponents = [
    MemberComponent,
    OrderComponent,
    AddressComponent
];
