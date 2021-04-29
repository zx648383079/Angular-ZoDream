import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { ApiEditComponent } from './api-edit/api-edit.component';
import { ApiFieldTrComponent } from './api-edit/api-field-tr/api-field-tr.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { CreateComponent } from './create/create.component';
import { DebugComponent } from './debug/debug.component';
import { DocumentBackendComponent } from './document-backend.component';
import { EditComponent } from './edit/edit.component';
import { PageEditComponent } from './page-edit/page-edit.component';


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
        path: 'debug/:id',
        component: DebugComponent,
    },
    {
        path: 'debug',
        component: DebugComponent,
    },
    {
        path: '',
        component: DocumentBackendComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentBackendRoutingModule {}

export const documentBackendRoutedComponents = [
    DocumentBackendComponent, PageEditComponent, ApiEditComponent,
    CreateComponent, EditComponent, ContextMenuComponent, ApiFieldTrComponent,
    DebugComponent
];