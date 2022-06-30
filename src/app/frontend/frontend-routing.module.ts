import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FriendLinkComponent } from './friend-link/friend-link.component';
import { CanActivateViaAuthGuard } from '../theme/guards';
import { AgreementComponent } from './agreement/agreement.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
    {
        path: '',
        component: FrontendComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
            { path: 'blog', loadChildren: () => import('../modules/blog/frontend/blog.module').then(m => m.BlogModule) },
            { path: 'forum', loadChildren: () => import('../modules/forum/forum.module').then(m => m.ForumModule) },
            { path: 'micro', loadChildren: () => import('../modules/micro/micro.module').then(m => m.MicroModule) },
            { path: 'note', loadChildren: () => import('../modules/note/note.module').then(m => m.NoteModule) },
            {
                path: 'legwork',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../modules/legwork/legwork.module').then(m => m.LegworkModule)
            },
            {
                path: 'exam',
                loadChildren: () => import('../modules/exam/exam.module').then(m => m.ExamModule)
            },
            {
                path: 'about',
                component: AboutComponent,
            },
            {
                path: 'agreement/:name',
                component: AgreementComponent,
            },
            {
                path: 'agreement',
                component: AgreementComponent,
            },
            {
                path: 'friend_link',
                component: FriendLinkComponent,
            }, {
                path: '',
                component: HomeComponent
            }, {
                path: '**',
                redirectTo: '',
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }

export const frontendRoutedComponents = [
    HomeComponent, FriendLinkComponent, AboutComponent, FrontendComponent, AgreementComponent, SearchComponent,
];
