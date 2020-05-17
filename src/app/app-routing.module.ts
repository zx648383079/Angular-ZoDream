import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: 'backend',
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
