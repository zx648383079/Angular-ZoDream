import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { ProfileComponent } from './profile/profile.component';
import { ConnectComponent } from './connect/connect.component';
import { PasswordComponent } from './password/password.component';
import { DriverComponent } from './driver/driver.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { BindStepComponent } from './profile/bind-step/bind-step.component';
import { CancelAccountComponent } from './cancel/cancel-account.component';

const routes: Routes = [
    {
        path: 'setting',
        component: SettingComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
    },
    {
        path: 'connect',
        component: ConnectComponent,
    },
    {
        path: 'password',
        component: PasswordComponent,
    },
    {
        path: 'driver',
        component: DriverComponent,
    },
    {
        path: 'authorize',
        component: AuthorizeComponent,
    },
    {
        path: 'cancel',
        component: CancelAccountComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemberRoutingModule { }

export const memberRoutedComponents = [
    SettingComponent, ProfileComponent, ConnectComponent, PasswordComponent, DriverComponent, AuthorizeComponent, BindStepComponent, CancelAccountComponent
];
