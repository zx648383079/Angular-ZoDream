import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { DebugComponent } from './debug/debug.component';
import { DocumentBackendComponent } from './document-backend.component';
import { CategoryComponent } from './category/category.component';


const routes: Routes = [
    {
        path: 'category',
        component: CategoryComponent
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
    DocumentBackendComponent, 
    DebugComponent, CategoryComponent
];