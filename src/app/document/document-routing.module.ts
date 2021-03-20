import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { DocumentComponent } from './document.component';
import { ProjectComponent } from './project/project.component';


const routes: Routes = [
    {
        path: 'api/:project/:version/:id',
        component: DetailComponent,
    },
    {
        path: 'api/:project/:version',
        component: DetailComponent,
    },
    {
        path: 'api/:project',
        component: DetailComponent,
    },
    {
        path: 'page/:project/:version/:id',
        component: DetailComponent,
    },
    {
        path: 'page/:project/:version',
        component: DetailComponent,
    },
    {
        path: 'page/:project',
        component: DetailComponent,
    },
    {
        path: 'project/:id',
        component: ProjectComponent,
    },
    {
        path: '',
        component: DocumentComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentRoutingModule {}

export const documentRoutedComponents = [
    DocumentComponent, ProjectComponent, DetailComponent,
];