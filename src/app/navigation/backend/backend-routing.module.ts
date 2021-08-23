import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationBackendComponent } from './navigation-backend.component';
import { PageComponent } from './page/page.component';
import { SiteComponent } from './site/site.component';

const routes: Routes = [
    { path: 'page', component: PageComponent },
    { path: 'site', component: SiteComponent },
    { path: '', component: NavigationBackendComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackendRoutingModule { }

export const backendRoutingComponents = [
    NavigationBackendComponent,
    PageComponent,
    SiteComponent,
];
