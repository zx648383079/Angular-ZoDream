import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoleComponent } from './role.component';
import { EditComponent } from './edit/edit.component';
import { PermissionComponent } from './permission/permission.component';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';

const routes: Routes = [
  { path: '', component: RoleComponent },
  {
    path: 'create',
    component: EditComponent
  },
  {
    path: 'permission',
    component: PermissionComponent,
  },
  {
    path: 'permission/create',
    component: EditPermissionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }


export const roleRoutedComponents = [
  RoleComponent, EditComponent, PermissionComponent, EditPermissionComponent
];
