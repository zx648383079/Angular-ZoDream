

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ShortLinkBackendComponent } from './short-link-backend.component';

const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: '', component: ShortLinkBackendComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShortBackendRoutingModule { }

export const shortBackendRoutingComponents = [
    ShortLinkBackendComponent, ListComponent
];
