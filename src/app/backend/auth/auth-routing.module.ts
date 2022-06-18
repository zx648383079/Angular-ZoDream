import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AuthComponent } from './auth.component';
import { EditUserComponent } from './user/edit/edit.component';
import { OauthComponent } from './oauth/oauth.component';
import { AdminLogComponent } from './admin-log/admin-log.component';
import { AccountLogComponent } from './user/account/account-log.component';
import { ActionLogComponent } from './user/action/action-log.component';
import { ApplyLogComponent } from './user/apply/apply-log.component';
import { ChangeAccountComponent } from './user/change/change-account.component';
import { InviteLogComponent } from './invite-code/log/invite-log.component';
import { InviteCodeComponent } from './invite-code/invite-code.component';
import { BanComponent } from './user/ban/ban.component';

const routes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'admin/log', component: AdminLogComponent },
    { path: 'users/account/log', component: AccountLogComponent },
    { path: 'users/action/log', component: ActionLogComponent },
    { path: 'users/apply/log', component: ApplyLogComponent },
    { path: 'users/ban', component: BanComponent },
    { path: 'users/account/change/:id', component: ChangeAccountComponent },
    { path: 'users', component: UserComponent },
    {
        path: 'users/create',
        component: EditUserComponent,
    },
    {
        path: 'users/edit/:id',
        component: EditUserComponent,
    },
    {
        path: 'invite/log',
        component: InviteLogComponent,
    },
    {
        path: 'invite/code',
        component: InviteCodeComponent,
    },
    {
        path: 'oauth',
        component: OauthComponent,
    },
    {
        path: 'role',
        loadChildren: () =>
            import('./role/role.module').then((m) => m.RoleModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}

export const authRoutedComponents = [
    AuthComponent,
    EditUserComponent,
    UserComponent,
    OauthComponent,
    AdminLogComponent,
    AccountLogComponent,
    ActionLogComponent,
    ApplyLogComponent,
    ChangeAccountComponent,
    InviteLogComponent,
    InviteCodeComponent,
    BanComponent
];
