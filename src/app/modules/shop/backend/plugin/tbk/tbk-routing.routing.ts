import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    NgModule
} from '@angular/core';
import {
    SettingComponent
} from './setting/setting.component';
import {
    TbkComponent
} from './tbk.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
    {
        path: 'setting',
        component: SettingComponent
    },
    {
        path: 'product',
        component: ProductComponent
    },
    {
        path: '',
        component: TbkComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TbkRoutingModule {}

export const tbkRoutedComponents = [
    SettingComponent,
    TbkComponent,
    ProductComponent
];
