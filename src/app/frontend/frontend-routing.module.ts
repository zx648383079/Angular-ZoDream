import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FriendLinkComponent } from './friend-link/friend-link.component';
import { CanActivateViaAuthGuard } from '../theme/guards';


const routes: Routes = [
    {
        path: '',
        component: FrontendComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
            { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
            { path: 'forum', loadChildren: () => import('./forum/forum.module').then(m => m.ForumModule) },
            { path: 'micro', loadChildren: () => import('./micro/micro.module').then(m => m.MicroModule) },
            {
                path: 'legwork',
                canActivate: [CanActivateViaAuthGuard],
                loadChildren: () => import('../legwork/legwork.module').then(m => m.LegworkModule)
            },
            {
                path: 'about',
                component: AboutComponent,
            }, {
                path: 'friend_link',
                component: FriendLinkComponent,
            }, {
                path: '',
                component: HomeComponent
            }, {
                path: '**',
                component: HomeComponent,
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
    HomeComponent, FriendLinkComponent, AboutComponent, FrontendComponent
];
