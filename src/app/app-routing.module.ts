import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
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
        loadChildren: () => import('./modules/task/task.module').then(m => m.TaskModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'frontend',
        loadChildren: () => import('./frontend/frontend.module').then(m => m.FrontendModule)
    },
    {
        path: 'disk',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./modules/disk/disk.module').then(m => m.DiskModule)
    },
    {
        path: 'chat',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule)
    },
    {
        path: 'counter',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./modules/trend-analysis/trend-analysis.module').then(m => m.TrendAnalysisModule)
    },
    { path: 'shop', loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule) },
    { path: 'blog', loadChildren: () => import('./modules/blog/blog.module').then(m => m.BlogModule) },
    { path: 'book', loadChildren: () => import('./modules/book/book.module').then(m => m.BookModule) },
    { path: 'catering', loadChildren: () => import('./modules/catering/catering.module').then(m => m.CateringModule) },
    { path: 'video', loadChildren: () => import('./modules/video/video.module').then(m => m.VideoModule) },
    { path: 'doc', loadChildren: () => import('./modules/document/document.module').then(m => m.DocumentModule) },
    { path: 'bot', loadChildren: () => import('./modules/bot/bot.module').then(m => m.BotModule) },
    { path: 'navigation', loadChildren: () => import('./modules/navigation/navigation.module').then(m => m.NavigationModule) },
    { path: 'app', loadChildren: () => import('./modules/app-store/app-store.module').then(m => m.AppStoreModule) },
    { path: 'res', loadChildren: () => import('./modules/resource-store/resource-store.module').then(m => m.ResourceStoreModule) },
    { path: 'tv', loadChildren: () => import('./modules/tv/tv.module').then(m => m.TvModule) },
    { 
        path: 'game/maker',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./modules/game/maker/game-maker.module').then(m => m.GameMakerModule) 
    },
    { 
        path: 'game/profiler',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./modules/game/profiler/game-profiler.module').then(m => m.GameProfilerModule) 
    },
    { path: 'game', loadChildren: () => import('./modules/game/game.module').then(m => m.GameModule) },
    {
        path: 'finance',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./modules/finance/finance.module').then(m => m.FinanceModule)
    },
    {
        path: 'visual',
        loadChildren: () => import('./modules/visual/visual.module').then(m => m.VisualModule)
    },
    {
        path: 'example',
        loadChildren: () => import('./example/example.module').then(m => m.ExampleModule)
    },
    {
        path: '',
        redirectTo: 'frontend',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'frontend'
    },
];

if (!environment.production) {
    routes.unshift({
        path: 'gzo',
        loadChildren: () => import('./modules/generator/generator.module').then(m => m.GeneratorModule)
    });
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
