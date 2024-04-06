import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { MessageComponent } from './message/message.component';


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
                component: BulletinComponent,
            },
            {
                path: 'message',
                component: MessageComponent,
            },
            {
                path: 'account',
                loadChildren: () => import('../../modules/auth/member/member.module').then(m => m.MemberModule)
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
    UserComponent, HomeComponent, BulletinComponent, MessageComponent
];
