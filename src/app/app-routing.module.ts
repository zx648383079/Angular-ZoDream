import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAuthGuard } from './theme/guards';


const routes: Routes = [
    {
        path: 'backend',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./backend/backend.module').then(m => m.BackendModule)
    },
    {
        path: 'task',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'frontend',
        loadChildren: () => import('./frontend/frontend.module').then(m => m.FrontendModule)
    },
    {
        path: '',
        redirectTo: 'frontend',
        pathMatch: 'full'
    },
    {
        path: 'disk',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./disk/disk.module').then(m => m.DiskModule)
    },
    {
        path: 'chat',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
    },
    { path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) },
    { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
    { path: 'book', loadChildren: () => import('./book/book.module').then(m => m.BookModule) },
    { path: 'catering', loadChildren: () => import('./catering/catering.module').then(m => m.CateringModule) },
    { path: 'video', loadChildren: () => import('./video/video.module').then(m => m.VideoModule) },
    { path: 'doc', loadChildren: () => import('./document/document.module').then(m => m.DocumentModule) },
    {
        path: '**',
        redirectTo: 'frontend'
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
