import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderComponent } from './order.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'create', component: CreateComponent },
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
  DetailComponent
];
