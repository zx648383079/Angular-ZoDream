import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoodsComponent } from './goods.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
    {
        path: '',
        component: GoodsComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'create',
                component: EditComponent,
            },
            {
                path: 'edit/:id',
                component: EditComponent,
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class GoodsRoutingModule {

}

export const goodsRoutedComponents = [
    GoodsComponent,
    ListComponent,
    EditComponent
];
