import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { KeywordComponent } from './keyword/keyword.component';
import { NavigationBackendComponent } from './navigation-backend.component';
import { PageComponent } from './page/page.component';
import { SiteComponent } from './site/site.component';
import { TagComponent } from './tag/tag.component';

const routes: Routes = [
    { path: 'page', component: PageComponent },
    { path: 'site', component: SiteComponent },
    { path: 'tag', component: TagComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'keyword', component: KeywordComponent },
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
    KeywordComponent,
    CategoryComponent,
    TagComponent,
];
