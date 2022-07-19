

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortLinkComponent } from './short-link.component';

const routes: Routes = [
    { path: '', component: ShortLinkComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShortRoutingModule { }

export const shortRoutingComponents = [
    ShortLinkComponent
];
