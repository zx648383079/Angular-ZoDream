import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortMemberComponent } from './short-member.component';

const routes: Routes = [
    {
        path: '',
        component: ShortMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShortMemberRoutingModule { }

export const ShortMemberRoutingComponents = [
    ShortMemberComponent
];
