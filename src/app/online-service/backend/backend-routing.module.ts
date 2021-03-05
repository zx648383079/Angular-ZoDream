import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceBackendComponent } from './service-backend.component';

const routes: Routes = [
    {
        path: '',
        component: ServiceBackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnlineServiceBackendRoutingModule {}

export const onlineServiceBackendRoutingComponents = [
    ServiceBackendComponent
];
