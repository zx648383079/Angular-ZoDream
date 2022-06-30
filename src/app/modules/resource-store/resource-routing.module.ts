import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceStoreComponent } from './resource-store.component';

const routes: Routes = [
    {
        path: '',
        component: ResourceStoreComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceStoreRoutingModule { }

export const resourceStoreRoutedComponents = [
    ResourceStoreComponent
];
