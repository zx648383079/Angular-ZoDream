import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { TradeTrackerComponent } from './trade-tracker.component';

const routes: Routes = [
    {
        path: '',
        component: TradeTrackerComponent
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
export class TrackerRoutingModule {}

export const TrackerRoutedComponents = [
    TradeTrackerComponent
];
