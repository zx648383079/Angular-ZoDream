import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { EditWeightComponent } from './edit/edit-weight.component';
import { SiteComponent } from './site/site.component';
import { SitePageComponent } from './site/page/page.component';
import { SiteWeightComponent } from './site/weight/site-weight.component';
import { SearchDialogComponent } from './search/search-dialog.component';

const routes: Routes = [
    {
        path: 'create',
        component: EditWeightComponent,
    },
    {
        path: 'edit/:id',
        component: EditWeightComponent,
    },
    {
        path: 'site/:site/page',
        component: SitePageComponent,
    },
    {
        path: 'site/:site/weight',
        component: SiteWeightComponent,
    },
    {
        path: 'site',
        component: SiteComponent,
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
export class VisualMemberRoutingModule { }

export const visualMemberRoutingComponents = [
    MemberComponent, EditWeightComponent, SiteComponent, SiteWeightComponent, SitePageComponent, SearchDialogComponent,
];
