import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeComponent } from './authorize/authorize.component';
import { OpenComponent } from './open.component';
import { EditComponent } from './platform/edit/edit.component';
import { PlatformComponent } from './platform/platform.component';
import { StatusPipe } from './status.pipe';


const routes: Routes = [
  { path: '', component: OpenComponent },
  { path: 'platform', component: PlatformComponent },
  { path: 'platform/create', component: EditComponent },
  { path: 'platform/edit/:id', component: EditComponent },
  { path: 'authorize', component: AuthorizeComponent },
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
