import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MicroMemberComponent } from './micro-member.component';

const routes: Routes = [
    {
        path: '',
        component: MicroMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MicroMemberRoutingModule { }

export const MicroMemberRoutingComponents = [
    MicroMemberComponent
];
