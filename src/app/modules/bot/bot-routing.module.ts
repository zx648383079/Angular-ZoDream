import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { EmulateComponent } from './emulate/emulate.component';
import { BotComponent } from './bot.component';
import { BotRichBlockComponent } from './rich-block/bot-rich-block.component';

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
        component: BotComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BotRoutingModule {}

export const botRoutingComponents = [
    BotComponent, EmulateComponent, DetailComponent, BotRichBlockComponent,
];