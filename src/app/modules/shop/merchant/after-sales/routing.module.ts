import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AfterSalesComponent } from './after-sales.component';

const routes: Routes = [
    {
        path: '',
        component: AfterSalesComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfterSalesRoutingModule { }

export const afterSalesRoutingComponents = [
    AfterSalesComponent
];
