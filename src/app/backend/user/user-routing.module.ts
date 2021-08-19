import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulletinComponent } from './bulletin/bulletin.component';
import { BulletinSendComponent } from './bulletin/send/bulletin-send.component';
import { ConnectComponent } from './connect/connect.component';
import { LogComponent } from './log/log.component';
import { LoginLogComponent } from './login-log/login-log.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { UserSettingComponent } from './setting/user-setting.component';
import { UserComponent } from './user.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
    },
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
        path: 'bulletin',
        component: BulletinComponent
    },
    {
        path: 'bulletin/send',
        component: BulletinSendComponent
    },
    {
        path: 'setting',
        component: UserSettingComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}

export const userRoutedComponents = [
    UserComponent, ConnectComponent,
    LogComponent, LoginLogComponent,
    PasswordComponent, ProfileComponent, BulletinComponent, BulletinSendComponent, UserSettingComponent
];
