import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { NavigationPanelComponent } from './panel/navigation-panel.component';
import { SearchInputComponent } from './search/search-input.component';
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
    SearchInputComponent,
    SiteComponent,
    SiteGroupComponent,
    NavigationPanelComponent,
    PageContainerComponent,
];
