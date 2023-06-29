import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentMemberComponent } from './document-member.component';
import { PageEditComponent } from './page-edit/page-edit.component';
import { ApiEditComponent } from './api-edit/api-edit.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
   
    {
        path: 'page/:project/:version',
        component: PageEditComponent,
    },
    {
        path: 'page/:project',
        component: PageEditComponent,
    },
    {
        path: 'api/:project/:version',
        component: ApiEditComponent,
    },
    {
        path: 'api/:project',
        component: ApiEditComponent,
    },
    {
        path: 'create',
        component: CreateComponent,
    },
    {
        path: 'edit/:id',
        component: EditComponent,
    },
    {
        path: '',
        component: DocumentMemberComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentMemberRoutingModule { }

export const documentMemberRoutingComponents = [
    DocumentMemberComponent, PageEditComponent, ApiEditComponent,
    CreateComponent, EditComponent
];