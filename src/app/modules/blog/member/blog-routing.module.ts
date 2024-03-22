import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { EditBlogComponent } from './edit/edit-blog.component';
import { AddPanelComponent } from './edit/add-panel/add-panel.component';
import { ExpandCardComponent } from './edit/expand-card/expand-card.component';

const routes: Routes = [
    {
        path: 'create',
        component: EditBlogComponent,
    },
    {
        path: 'edit/:id',
        component: EditBlogComponent,
    },
    {
        path: '',
        component: MemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogMemberRoutingModule { }

export const blogMemberRoutingComponents = [
    MemberComponent, EditBlogComponent, AddPanelComponent, ExpandCardComponent,
];
