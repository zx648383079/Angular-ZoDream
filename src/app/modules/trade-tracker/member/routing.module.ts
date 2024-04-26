import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { TradeTrackerMemberComponent } from './member.component';

const routes: Routes = [
    {
        path: '',
        component: TradeTrackerMemberComponent
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
export class TrackerMemberRoutingModule {}

export const TrackerMemberRoutedComponents = [
    TradeTrackerMemberComponent
];
