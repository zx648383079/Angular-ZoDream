import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualMarketComponent } from './visual-market.component';
import { SearchComponent } from './search/search.component';
import { CategoryComponent } from './category/category.component';
import { PreviewComponent } from './preview/preview.component';
import { HomeComponent } from './home/home.component';
import { SiteComponent } from './site/site.component';
import { AddDialogComponent } from './dialog/add-dialog/add-dialog.component';
import { CloneDialogComponent } from './dialog/clone-dialog/clone-dialog.component';

const routes: Routes = [
    {
        path: 'preview/:id',
        component: PreviewComponent,
    },
    {
        path: '',
        component: VisualMarketComponent,
        children: [
            {
                path: 'search',
                component: SearchComponent,
            },
            {
                path: 'category/:id',
                component: CategoryComponent,
            },
            {
                path: 'site',
                component: SiteComponent,
            },
            {
                path: '',
                component: HomeComponent,
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisualMarketRoutingModule { }

export const visualMarketRoutingComponents = [
    VisualMarketComponent, SearchComponent, CategoryComponent, PreviewComponent, HomeComponent, SiteComponent, AddDialogComponent, CloneDialogComponent
];