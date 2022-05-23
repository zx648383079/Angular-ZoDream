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
import {
    SettingComponent
} from './tbk/setting/setting.component';
import {
    TbkComponent
} from './tbk/tbk.component';

const routes: Routes = [{
        path: '',
        component: PluginComponent
    },
    {
        path: 'tbk/setting',
        component: SettingComponent
    },
    {
        path: 'tbk',
        component: TbkComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PluginRoutingModule {}

export const pluginRoutedComponents = [
    PluginComponent,
    SettingComponent,
    TbkComponent
];
