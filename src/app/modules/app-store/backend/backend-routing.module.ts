import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { AppBackendComponent } from './app-backend.component';
import { CategoryComponent } from './category/category.component';
import { CommentComponent } from './comment/comment.component';
import { EditSoftwareComponent } from './software/edit/edit-software.component';
import { PackageComponent } from './software/package/package.component';
import { SoftwareComponent } from './software/software.component';
import { VersionComponent } from './software/version/version.component';
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
        path: 'software/create',
        component: EditSoftwareComponent,
    },
    {
        path: 'software/edit/:id',
        component: EditSoftwareComponent,
    },
    {
        path: 'software/version/:id',
        component: VersionComponent,
    },
    {
        path: 'software/package/:id/:version',
        component: PackageComponent,
    },
    {
        path: 'software',
        component: SoftwareComponent,
    },
    {
        path: '',
        component: AppBackendComponent
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
    AppBackendComponent, SoftwareComponent, EditSoftwareComponent, PackageComponent, VersionComponent,
    CommentComponent, TagComponent, CategoryComponent,
];
