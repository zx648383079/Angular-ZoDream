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
            loadChildren: () => import('../shop/backend/shop.module').then(m => m.ShopBackendModule)
        },
        {
            path: 'system',
            loadChildren: () => import('./system/system.module').then(m => m.SystemModule)
        },
        {
            path: 'blog',
            loadChildren: () => import('../blog/backend/blog.module').then(m => m.BlogBackendModule)
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
            loadChildren: () => import('../forum/backend/forum.module').then(m => m.ForumModule)
        },
        {
            path: 'video',
            loadChildren: () => import('../video/backend/video.module').then(m => m.VideoModule)
        },
        {
            path: 'legwork',
            loadChildren: () => import('../legwork/backend/legwork-backend.module').then(m => m.LegworkBackendModule)
        },
        {
            path: 'book',
            loadChildren: () => import('../book/backend/backend.module').then(m => m.BackendModule)
        },
        {
            path: 'os',
            loadChildren: () => import('../online-service/backend/service-backend.module').then(m => m.ServiceBackendModule)
        },
        {
            path: 'doc',
            loadChildren: () => import('../document/backend/document-backend.module').then(m => m.DocumentBackendModule)
        },
        {
            path: 'exam',
            loadChildren: () => import('../exam/backend/exam-backend.module').then(m => m.ExamBackendModule)
        },
        {
            path: 'micro',
            loadChildren: () => import('../micro/backend/micro.module').then(m => m.MicroModule)
        },
        {
            path: 'cms',
            loadChildren: () => import('../cms/backend/cms-backend.module').then(m => m.CmsBackendModule)
        },
        {
            path: 'wx',
            loadChildren: () => import('../wechat/backend/wechat-backend.module').then(m => m.WechatBackendModule)
        },
        {
            path: 'checkin',
            loadChildren: () => import('../checkin/backend/checkin-backend.module').then(m => m.CheckinBackendModule)
        },
        {
            path: '',
            component: HomeComponent
        },
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
