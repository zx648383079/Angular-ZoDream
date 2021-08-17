import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantComponent,
        children: [

        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }

export const merchantRoutingComponents = [
    MerchantComponent
];
