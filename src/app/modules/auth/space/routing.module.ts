import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberSpaceComponent } from './member-space.component';

const routes: Routes = [
    {
        path: ':user',
        component: MemberSpaceComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MemberSpaceRoutingModule { }

export const memberSpaceRoutedComponents = [
    MemberSpaceComponent
];
