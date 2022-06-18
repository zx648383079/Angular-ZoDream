import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { PageCardComponent } from './page-card/page-card.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { NavigationPanelComponent } from './panel/navigation-panel.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { CategoryPanelComponent } from './site/category-panel/category-panel.component';
import { SiteGroupComponent } from './site/group/site-group.component';
import { SiteComponent } from './site/site.component';

const routes: Routes = [
    { path: '', component: NavigationComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NavigationRoutingModule { }

export const navigationRoutingComponents = [
    NavigationComponent,
    SiteComponent,
    SiteGroupComponent,
    NavigationPanelComponent,
    PageContainerComponent,
    CategoryPanelComponent,
    PageCardComponent,
    ReportDialogComponent,
];
