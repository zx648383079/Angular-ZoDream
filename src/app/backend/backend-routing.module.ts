import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    BackendComponent
} from './backend.component';
import {
    HomeComponent
} from './home/home.component';
import {
    NotFoundComponent
} from './not-found/not-found.component';

const routes: Routes = [{
    path: '',
    component: BackendComponent,
    children: [{
            path: 'user',
            loadChildren: () => import('./user/user.module').then(m => m.UserModule)
        },
        {
            path: 'auth',
            loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
        },
        {
            path: 'shop',
            loadChildren: () => import('../modules/shop/backend/shop.module').then(m => m.ShopBackendModule)
        },
        {
            path: 'system',
            loadChildren: () => import('./system/system.module').then(m => m.SystemModule)
        },
        {
            path: 'blog',
            loadChildren: () => import('../modules/blog/backend/blog.module').then(m => m.BlogBackendModule)
        },
        {
            path: 'contact',
            loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
        },
        {
            path: 'open',
            loadChildren: () => import('./open/open.module').then(m => m.OpenModule)
        },
        {
            path: 'sms',
            loadChildren: () => import('./sms/sms.module').then(m => m.SmsModule)
        },
        {
            path: 'forum',
            loadChildren: () => import('../modules/forum/backend/forum.module').then(m => m.ForumModule)
        },
        {
            path: 'video',
            loadChildren: () => import('../modules/video/backend/video.module').then(m => m.VideoModule)
        },
        {
            path: 'app',
            loadChildren: () => import('../modules/app-store/backend/app-backend.module').then(m => m.AppBackendModule)
        },
        {
            path: 'tv',
            loadChildren: () => import('../modules/tv/backend/tv-backend.module').then(m => m.TvBackendModule)
        },
        {
            path: 'res',
            loadChildren: () => import('../modules/resource-store/backend/resource-backend.module').then(m => m.ResourceBackendModule)
        },
        {
            path: 'legwork',
            loadChildren: () => import('../modules/legwork/backend/legwork-backend.module').then(m => m.LegworkBackendModule)
        },
        {
            path: 'book',
            loadChildren: () => import('../modules/book/backend/backend.module').then(m => m.BackendModule)
        },
        {
            path: 'os',
            loadChildren: () => import('../modules/online-service/backend/service-backend.module').then(m => m.ServiceBackendModule)
        },
        {
            path: 'doc',
            loadChildren: () => import('../modules/document/backend/document-backend.module').then(m => m.DocumentBackendModule)
        },
        {
            path: 'exam',
            loadChildren: () => import('../modules/exam/backend/exam-backend.module').then(m => m.ExamBackendModule)
        },
        {
            path: 'micro',
            loadChildren: () => import('../modules/micro/backend/micro.module').then(m => m.MicroModule)
        },
        {
            path: 'cms',
            loadChildren: () => import('../modules/cms/backend/cms-backend.module').then(m => m.CmsBackendModule)
        },
        {
            path: 'wx',
            loadChildren: () => import('../modules/wechat/backend/wechat-backend.module').then(m => m.WechatBackendModule)
        },
        {
            path: 'checkin',
            loadChildren: () => import('../modules/checkin/backend/checkin-backend.module').then(m => m.CheckinBackendModule)
        },
        {
            path: 'navigation',
            loadChildren: () => import('../modules/navigation/backend/navigation-backend.module').then(m => m.NavigationBackendModule)
        },
        {
            path: 'note',
            loadChildren: () => import('../modules/note/backend/note-backend.module').then(m => m.NoteBackendModule)
        },
        {
            path: 'disk',
            loadChildren: () => import('../modules/disk/backend/disk-backend.module').then(m => m.DiskBackendModule)
        },
        {
            path: 'short',
            loadChildren: () => import('../modules/short-link/backend/short-link-backend.module').then(m => m.ShortLinkBackendModule)
        },
        {
            path: '',
            component: HomeComponent
        },
        {
            path: '**',
            redirectTo: '',
        }
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackendRoutingModule {}

export const backendRoutedComponents = [
    BackendComponent, HomeComponent,
    NotFoundComponent
];
