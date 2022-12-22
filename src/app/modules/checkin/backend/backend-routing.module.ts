import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { CheckinBackendComponent } from './checkin-backend.component';
import { LogComponent } from './log/log.component';
import { OptionComponent } from './option/option.component';

const routes: Routes = [
    {
        path: 'option',
        component: OptionComponent,
    },
    {
        path: 'log',
        component: LogComponent,
    },
    {
        path: '',
        component: CheckinBackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckInBackendRoutingModule {}


export const checkInBackendRoutingComponents = [
    CheckinBackendComponent, OptionComponent, LogComponent
];
