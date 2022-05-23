import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { CheckinBackendComponent } from './checkin-backend.component';
import { OptionComponent } from './option/option.component';

const routes: Routes = [
    {
        path: 'option',
        component: OptionComponent,
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
    CheckinBackendComponent, OptionComponent
];
