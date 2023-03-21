import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualBackendComponent } from './visual-backend.component';
import { CategoryComponent } from './category/category.component';
import { SiteComponent } from './site/site.component';
import { PageComponent } from './page/page.component';
import { WeightComponent } from './weight/weight.component';
import { EditWeightComponent } from './weight/edit/edit-weight.component';

const routes: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: 'weight/create',
        component: EditWeightComponent,
    },
    {
        path: 'weight/edit/:id',
        component: EditWeightComponent,
    },
    {
        path: 'weight',
        component: WeightComponent,
    },
    {
        path: 'site',
        component: SiteComponent,
    },
    {
        path: 'page',
        component: PageComponent,
    },
    {
        path: '',
        component: VisualBackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisualBackendRoutingModule { }


export const visualBackendRoutingComponents = [
    VisualBackendComponent, CategoryComponent, SiteComponent, WeightComponent, PageComponent, EditWeightComponent
];
