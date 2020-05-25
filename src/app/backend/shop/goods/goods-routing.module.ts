import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoodsComponent } from './goods.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { TrashComponent } from './trash/trash.component';
import { BrandComponent } from './brand/brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { GroupComponent } from './group/group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { AttributeComponent } from './attribute/attribute.component';
import { EditAttributeComponent } from './edit-attribute/edit-attribute.component';

const routes: Routes = [
    {
        path: '',
        component: GoodsComponent,
    },
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
    },
    {
        path: 'trash',
        component: TrashComponent,
    },
    {
        path: 'brand',
        component: BrandComponent,
    },
    {
        path: 'brand/create',
        component: EditBrandComponent,
    },
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: 'category/create',
        component: EditCategoryComponent,
    },
    {
        path: 'group',
        component: GroupComponent,
    },
    {
        path: 'group/create',
        component: EditGroupComponent,
    },
    {
        path: 'attribute',
        component: AttributeComponent,
    },
    {
        path: 'attribute/create',
        component: EditAttributeComponent,
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
    EditComponent,
    TrashComponent,
    BrandComponent,
    EditBrandComponent,
    CategoryComponent,
    EditCategoryComponent,
    GroupComponent,
    EditGroupComponent,
    AttributeComponent,
    EditAttributeComponent
];
