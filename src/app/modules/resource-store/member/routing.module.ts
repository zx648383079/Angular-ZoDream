import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceMemberComponent } from './resource-member.component';
import { EditResourceComponent } from './edit/edit-resource.component';

const routes: Routes = [
    {
        path: 'create',
        component: EditResourceComponent,
    },
    {
        path: 'edit/:id',
        component: EditResourceComponent,
    },
    {
        path: '',
        component: ResourceMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourceMemberRoutingModule { }

export const resourceMemberRoutingComponents = [
    ResourceMemberComponent, EditResourceComponent
];
