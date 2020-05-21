import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RoleRoutingModule } from './role-routing.module';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';
import { PermissionComponent } from './permission/permission.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    RoleRoutingModule
  ],
  declarations: [RoleComponent, EditPermissionComponent, PermissionComponent, EditComponent]
})
export class RoleModule { }
