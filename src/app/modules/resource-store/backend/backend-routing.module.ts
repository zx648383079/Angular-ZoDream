import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CommentComponent } from './comment/comment.component';
import { ResourceBackendComponent } from './resource-backend.component';
import { EditResourceComponent } from './resource/edit/edit-resource.component';
import { ResourceComponent } from './resource/resource.component';
import { TagComponent } from './tag/tag.component';

const routes: Routes = [
    {
        path: 'comment',
        component: CommentComponent,
    },
    {
        path: 'tag',
        component: TagComponent,
    },
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: 'resource/create',
        component: EditResourceComponent,
    },
    {
        path: 'resource/edit/:id',
        component: EditResourceComponent,
    },
    {
        path: 'resource',
        component: ResourceComponent,
    },
    {
        path: '',
        component: ResourceBackendComponent
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackendRoutingModule {}

export const backendRoutedComponents = [
    ResourceBackendComponent, ResourceComponent, EditResourceComponent,
    CommentComponent, TagComponent, CategoryComponent,
];
