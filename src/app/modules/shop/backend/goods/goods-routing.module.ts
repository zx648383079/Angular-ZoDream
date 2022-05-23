import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoodsComponent } from './goods.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { TrashComponent } from './trash/trash.component';
import { BrandComponent } from './brand/brand.component';
import { EditBrandComponent } from './brand/edit/edit-brand.component';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './category/edit/edit-category.component';
import { GroupComponent } from './group/group.component';
import { EditGroupComponent } from './group/edit/edit-group.component';
import { AttributeComponent } from './attribute/attribute.component';
import { EditAttributeComponent } from './attribute/edit/edit-attribute.component';
import { SearchTypePipe } from './search-type.pipe';
import { AttributeTypePipe } from './attribute-type.pipe';
import { GoodsCardComponent } from './card/goods-card.component';

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
        path: 'card/:goods',
        component: GoodsCardComponent,
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
        path: 'brand/edit/:id',
        component: EditBrandComponent,
    },
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: 'category/edit/:id',
        component: EditCategoryComponent,
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
        path: 'group/edit/:id',
        component: EditGroupComponent,
    },
    {
        path: 'attribute/:group',
        component: AttributeComponent,
    },
    {
        path: 'attribute/create/:group',
        component: EditAttributeComponent,
    },
    {
        path: 'attribute/edit/:id',
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
    GoodsCardComponent,
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
    EditAttributeComponent,
];

export const goodsPipes = [
    SearchTypePipe,
    AttributeTypePipe,
];
