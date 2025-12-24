import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { MessageComponent } from './message/message.component';
import { ZoneComponent } from './zone/zone.component';
import { CanActivateViaAuthGuard } from '../../theme/guards';


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
                path: 'bulletin',
                canActivate: [CanActivateViaAuthGuard],
                component: BulletinComponent,
            },
            {
                path: 'message',
                canActivate: [CanActivateViaAuthGuard],
                component: MessageComponent,
            },
            {
                path: 'zone',
                canActivate: [CanActivateViaAuthGuard],
                component: ZoneComponent,
            },
            {
                path: 'account',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/auth/member/member.module').then(m => m.MemberModule)
            },
            {
                path: 'blog',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/blog/member/member.module').then(m => m.BlogMemberModule)
            },
            {
                path: 'doc',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/document/member/document-member.module').then(m => m.DocumentMemberModule)
            },
            {
                path: 'exam',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/exam/member/exam-member.module').then(m => m.ExamMemberModule)
            },
            {
                path: 'forum',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/forum/member/forum-member.module').then(m => m.ForumMemberModule)
            },
            {
                path: 'micro',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/micro/member/micro-member.module').then(m => m.MicroMemberModule)
            },
            {
                path: 'note',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/note/member/note-member.module').then(m => m.NoteMemberModule)
            },
            {
                path: 'tracker',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/trade-tracker/member/member.module').then(m => m.TradeTrackerMemberModule)
            },
            {
                path: 'short',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/short-link/member/short-member.module').then(m => m.ShortMemberModule)
            },
            {
                path: 'res',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../../modules/resource-store/member/resource-member.module').then(m => m.ResourceMemberModule)
            },
            {
                path: 'visual',
                canActivate: [CanActivateViaAuthGuard],
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
    UserComponent, HomeComponent, BulletinComponent, MessageComponent, ZoneComponent
];
