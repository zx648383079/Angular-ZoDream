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
    { path: 'disk', loadChildren: () => import('./disk/disk.module').then(m => m.DiskModule) },
    { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
    { path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) },
    { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
    { path: 'book', loadChildren: () => import('./book/book.module').then(m => m.BookModule) },
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
