import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductEditComponent } from './edit/product-edit.component';
import { ProductCardComponent } from './card/product-card.component';
import { ProductIssueComponent } from './issue/product-issue.component';

const routes: Routes = [
    {
        path: 'create',
        component: ProductEditComponent,
    },
    {
        path: 'card/:goods',
        component: ProductCardComponent,
    },
    {
        path: 'issue/:goods',
        component: ProductIssueComponent,
    },
    {
        path: ':id',
        component: ProductEditComponent,
    },
    {
        path: '',
        component: ProductComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

export const productRoutingComponents = [
    ProductComponent, ProductEditComponent, ProductIssueComponent, ProductCardComponent
];
