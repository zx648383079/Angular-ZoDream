import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { ProfileComponent } from './profile/profile.component';
import { ConnectComponent } from './connect/connect.component';
import { PasswordComponent } from './password/password.component';
import { LoginLogComponent } from './login-log/login-log.component';
import { LogComponent } from './log/log.component';
import { EditComponent } from './edit/edit.component';
import { BulletinComponent } from './bulletin/bulletin.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'connect',
    component: ConnectComponent
  },
  {
    path: 'password',
    component: PasswordComponent
  },
  {
    path: 'login-log',
    component: LoginLogComponent
  },
  {
    path: 'log',
    component: LogComponent
  },
  {
    path: 'create',
    component: EditComponent
  },
  {
    path: 'bulletin',
    component: BulletinComponent
  },
  { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

export const authRoutedComponents = [
  AuthComponent, ConnectComponent, LogComponent, LoginLogComponent, PasswordComponent, ProfileComponent, BulletinComponent, EditComponent,
];
