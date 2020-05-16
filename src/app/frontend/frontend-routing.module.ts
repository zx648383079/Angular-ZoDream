import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FriendLinkComponent } from './friend-link/friend-link.component';


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
            {
                path: 'about',
                component: AboutComponent,
            }, {
                path: 'friend_link',
                component: FriendLinkComponent,
            }, {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
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
