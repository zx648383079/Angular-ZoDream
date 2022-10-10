import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    NgModule
} from '@angular/core';
import {
    PluginComponent
} from './plugin.component';

const routes: Routes = [
    {
        path: 'tbk',
        loadChildren: () => import('./tbk/tbk.module').then(m => m.TbkModule)
    },
    {
        path: 'affiliate',
        loadChildren: () => import('./affiliate/affiliate.module').then(m => m.AffiliateModule)
    },
    {
        path: '',
        component: PluginComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PluginRoutingModule {}

export const pluginRoutedComponents = [
    PluginComponent,
];
