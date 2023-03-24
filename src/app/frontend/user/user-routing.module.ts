import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeComponent } from './authorize/authorize.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { ConnectComponent } from './connect/connect.component';
import { DriverComponent } from './driver/driver.component';
import { HomeComponent } from './home/home.component';
import { PasswordComponent } from './password/password.component';
import { BindStepComponent } from './profile/bind-step/bind-step.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { UserComponent } from './user.component';


const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
            {
                path: 'setting',
                component: SettingComponent,
            },
            {
                path: 'bulletin',
                component: BulletinComponent,
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
                path: 'blog',
                loadChildren: () => import('../../modules/blog/member/member.module').then(m => m.BlogMemberModule)
            },
            {
                path: 'doc',
                loadChildren: () => import('../../modules/document/member/document-member.module').then(m => m.DocumentMemberModule)
            },
            {
                path: 'exam',
                loadChildren: () => import('../../modules/exam/member/exam-member.module').then(m => m.ExamMemberModule)
            },
            {
                path: 'forum',
                loadChildren: () => import('../../modules/forum/member/forum-member.module').then(m => m.ForumMemberModule)
            },
            {
                path: 'micro',
                loadChildren: () => import('../../modules/micro/member/micro-member.module').then(m => m.MicroMemberModule)
            },
            {
                path: 'note',
                loadChildren: () => import('../../modules/note/member/note-member.module').then(m => m.NoteMemberModule)
            },
            {
                path: 'short',
                loadChildren: () => import('../../modules/short-link/member/short-member.module').then(m => m.ShortMemberModule)
            },
            {
                path: 'visual',
                loadChildren: () => import('../../modules/visual/member/member.module').then(m => m.VisualMemberModule)
            },
            {
                path: '**',
                redirectTo: 'home',
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

export const userRoutedComponents = [
    UserComponent, HomeComponent, SettingComponent, BulletinComponent,
    ProfileComponent, ConnectComponent, PasswordComponent, DriverComponent,
    AuthorizeComponent, BindStepComponent,
];
