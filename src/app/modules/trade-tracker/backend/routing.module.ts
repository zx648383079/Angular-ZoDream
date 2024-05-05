import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { TradeTrackerBackendComponent } from './backend.component';
import { ChannelComponent } from './channel/channel.component';
import { ProductComponent } from './product/product.component';
import { LogComponent } from './log/log.component';

const routes: Routes = [
    {
        path: '',
        component: TradeTrackerBackendComponent
    },
    {
        path: 'channel',
        component: ChannelComponent
    },
    {
        path: 'product',
        component: ProductComponent
    },
    {
        path: 'log',
        component: LogComponent
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrackerBackendRoutingModule {}

export const TrackerBackendRoutedComponents = [
    TradeTrackerBackendComponent, ChannelComponent, ProductComponent, LogComponent
];
