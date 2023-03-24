import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumMemberComponent } from './forum-member.component';

const routes: Routes = [
    {
        path: '',
        component: ForumMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForumMemberRoutingModule { }

export const ForumMemberRoutingComponents = [
    ForumMemberComponent
];
