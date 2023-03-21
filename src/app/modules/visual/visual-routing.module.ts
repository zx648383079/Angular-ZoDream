import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAuthGuard } from '../../theme/guards';
import { PreviewComponent } from './preview/preview.component';
import { VisualComponent } from './visual.component';
import { VisualStudioComponent } from './studio/visual-studio.component';

const routes: Routes = [
    {
        path: 'market', 
        loadChildren: () => import('./market/visual-market.module').then(m => m.VisualMarketModule) 
    },
    { 
        path: 'preview/:site/:id', 
        canActivate: [CanActivateViaAuthGuard],
        component: PreviewComponent,
    }, 
    { 
        path: 'editor/:site/:id', 
        canActivate: [CanActivateViaAuthGuard],
        component: VisualStudioComponent
    },
    { 
        path: 'editor',
        canActivate: [CanActivateViaAuthGuard],
        loadChildren: () => import('./editor/visual-editor.module').then(m => m.VisualEditorModule) 
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'market'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisualRoutingModule { }

export const visualRoutingComponents = [
    PreviewComponent, VisualComponent, VisualStudioComponent
];
