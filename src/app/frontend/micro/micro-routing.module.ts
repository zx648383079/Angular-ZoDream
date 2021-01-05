import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicroComponent } from './micro.component';
import { PublishFormComponent } from './publish-form/publish-form.component';
import { ShareComponent } from './share/share.component';

const routes: Routes = [
    { path: 'share', component: ShareComponent },
    { path: '', component: MicroComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MicroRoutingModule { }

export const microRoutingComponents = [
    MicroComponent, ShareComponent, PublishFormComponent
];
