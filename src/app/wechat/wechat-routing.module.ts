import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { EmulateComponent } from './emulate/emulate.component';
import { WechatComponent } from './wechat.component';

const routes: Routes = [
    {
        path: 'emulate/:id/:media',
        component: DetailComponent
    },
    {
        path: 'emulate/:id',
        component: EmulateComponent
    },
    {
        path: '',
        component: WechatComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WechatRoutingModule {}

export const wechatRoutingComponents = [
    WechatComponent, EmulateComponent, DetailComponent
];