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
import { WechatRichBlockComponent } from './rich-block/wechat-rich-block.component';

const routes: Routes = [
    {
        path: 'emulate/:wid/:id',
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
    WechatComponent, EmulateComponent, DetailComponent, WechatRichBlockComponent,
];