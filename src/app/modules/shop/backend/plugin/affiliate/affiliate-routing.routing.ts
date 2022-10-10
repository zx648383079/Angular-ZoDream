import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    NgModule
} from '@angular/core';
import {
    SettingComponent
} from './setting/setting.component';
import { LogComponent } from './log/log.component';
import { AffiliateComponent } from './affiliate.component';

const routes: Routes = [
    {
        path: 'setting',
        component: SettingComponent
    },
    {
        path: 'log',
        component: LogComponent
    },
    {
        path: '',
        component: AffiliateComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AffiliateRoutingModule {}

export const affiliateRoutedComponents = [
    SettingComponent,
    AffiliateComponent,
    LogComponent
];
