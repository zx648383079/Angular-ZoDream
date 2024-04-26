import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { TradeTrackerBackendComponent } from './backend.component';

const routes: Routes = [
    {
        path: '',
        component: TradeTrackerBackendComponent
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
    TradeTrackerBackendComponent
];
