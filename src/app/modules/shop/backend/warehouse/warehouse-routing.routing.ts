import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    NgModule
} from '@angular/core';
import { WarehouseComponent } from './warehouse.component';
import { LogComponent } from './log/log.component';
import { DetailComponent } from './detail/detail.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: DetailComponent
    },
    {
        path: 'create',
        component: DetailComponent
    },
    {
        path: 'log/:warehouse',
        component: LogComponent
    },
    {
        path: ':warehouse',
        component: ProductComponent
    },
    {
        path: '',
        component: WarehouseComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseRoutingModule {}

export const warehouseRoutedComponents = [
    WarehouseComponent, ProductComponent, LogComponent, DetailComponent
];
