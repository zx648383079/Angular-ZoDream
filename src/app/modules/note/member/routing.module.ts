import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteMemberComponent } from './note-member.component';

const routes: Routes = [
    {
        path: '',
        component: NoteMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoteMemberRoutingModule { }

export const NoteMemberRoutingComponents = [
    NoteMemberComponent
];
