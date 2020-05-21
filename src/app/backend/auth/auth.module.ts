import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectComponent } from './connect/connect.component';
import { LogComponent } from './log/log.component';
import { LoginLogComponent } from './login-log/login-log.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { BulletinComponent } from './bulletin/bulletin.component';


@NgModule({
  declarations: [AuthComponent, ConnectComponent, LogComponent, LoginLogComponent, PasswordComponent, ProfileComponent, BulletinComponent],
  imports: [
    CommonModule,
    NgbPaginationModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
