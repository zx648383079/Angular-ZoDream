import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderComponent } from './order.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { EditDeliveryComponent } from './delivery/edit/edit-delivery.component';
import { AddressPickerComponent } from './address-picker/address-picker.component';
import { CouponPickerComponent } from './coupon-picker/coupon-picker.component';

const routes: Routes = [
    { path: '', component: OrderComponent },
    { path: 'create', component: CreateComponent },
    { path: 'delivery/create', component: EditDeliveryComponent },
    { path: 'delivery', component: DeliveryComponent },
    { path: ':id', component: DetailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule {}

export const orderRoutedComponents = [
    OrderComponent,
    CreateComponent,
    DetailComponent,
    DeliveryComponent,
    EditDeliveryComponent,
    AddressPickerComponent,
    CouponPickerComponent
];
