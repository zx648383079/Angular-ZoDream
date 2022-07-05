import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CommentComponent } from './detail/comment/comment.component';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home/home.component';
import { PreviewComponent } from './preview/preview.component';
import { ResourceStoreComponent } from './resource-store.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
    {
        path: '',
        component: ResourceStoreComponent,
        children: [
            {
                path: 'category/:category/:id/preview',
                component: PreviewComponent
            },
            {
                path: 'category/:category/:id',
                component: DetailComponent
            },
            {
                path: 'category/:id',
                component: CategoryComponent
            },
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'search',
                component: SearchComponent
            },
            {
                path: '',
                component: HomeComponent
            },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceStoreRoutingModule { }

export const resourceStoreRoutedComponents = [
    ResourceStoreComponent, CategoryComponent, DetailComponent, HomeComponent, PreviewComponent, SearchComponent, CommentComponent,
];
