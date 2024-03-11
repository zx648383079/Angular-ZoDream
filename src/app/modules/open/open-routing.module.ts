import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeComponent } from './authorize/authorize.component';
import { OpenComponent } from './open.component';
import { EditComponent } from './platform/edit/edit.component';
import { PlatformComponent } from './platform/platform.component';


const routes: Routes = [
    { path: 'platform/create', component: EditComponent },
    { path: 'platform/edit/:id', component: EditComponent },
    { path: 'platform/review/edit/:id', component: EditComponent },
    { path: 'platform/review', component: PlatformComponent },
    { path: 'platform', component: PlatformComponent },
    { path: 'authorize', component: AuthorizeComponent },
    { path: '', component: OpenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenRoutingModule { }

export const openRoutedComponents = [
    OpenComponent,
    PlatformComponent,
    AuthorizeComponent,
    EditComponent,
];
