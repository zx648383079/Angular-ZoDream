import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './category/edit/edit-category.component';
import { CmsBackendComponent } from './cms-backend.component';
import { ContentComponent } from './content/content.component';
import { EditContentComponent } from './content/edit/edit-content.component';
import { FormDetailComponent } from './form/detail/detail.component';
import { FormComponent } from './form/form.component';
import { GroupComponent } from './group/group.component';
import { LinkageDataComponent } from './linkage/data/linkage-data.component';
import { LinkageComponent } from './linkage/linkage.component';
import { EditModelComponent } from './model/edit/edit-model.component';
import { EditFieldComponent } from './model/field/edit/edit-field.component';
import { ModelFieldComponent } from './model/field/model-field.component';
import { ModelComponent } from './model/model.component';
import { EditSiteComponent } from './site/edit/edit-site.component';
import { SiteOptionComponent } from './site/option/site-option.component';
import { SiteComponent } from './site/site.component';

const routes: Routes = [
    {
        path: 'site/create',
        component: EditSiteComponent,
    },
    {
        path: 'site/edit/:id',
        component: EditSiteComponent,
    },
    {
        path: 'site/:id/option',
        component: SiteOptionComponent,
    },
    {
        path: 'site/:site/category/create',
        component: EditCategoryComponent,
    },
    {
        path: 'site/:site/category/edit/:id',
        component: EditCategoryComponent,
    },
    {
        path: 'site/:site/category',
        component: CategoryComponent,
    },
    {
        path: 'site/:site/content/:category/:model/:parent/create',
        component: EditContentComponent,
    },
    {
        path: 'site/:site/content/:category/:model/:parent/edit/:id',
        component: EditContentComponent,
    },
    {
        path: 'site/:site/content/:category/:model/:parent',
        component: ContentComponent,
    },
    {
        path: 'site/:site/form/:model/:id',
        component: FormDetailComponent,
    },
    {
        path: 'site/:site/form/:model',
        component: FormComponent,
    },
    {
        path: 'site/:site/form',
        component: ModelComponent,
    },
    {
        path: 'site',
        component: SiteComponent,
    },
    {
        path: 'model/create',
        component: EditModelComponent,
    },
    {
        path: 'model/edit/:id',
        component: EditModelComponent,
    },
    {
        path: 'model/field/:model/create',
        component: EditFieldComponent,
    },
    {
        path: 'model/field/:model/edit/:id',
        component: EditFieldComponent,
    },
    {
        path: 'model/field/:model',
        component: ModelFieldComponent,
    },
    {
        path: 'model',
        component: ModelComponent,
    },
    {
        path: 'group',
        component: GroupComponent,
    },
    {
        path: 'linkage/:linkage',
        component: LinkageDataComponent,
    },
    {
        path: 'linkage',
        component: LinkageComponent,
    },
    {
        path: '',
        component: CmsBackendComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CMSBackendRoutingModule {}

export const cmsBackendRoutedComponents = [
    CmsBackendComponent, CategoryComponent, SiteComponent, ModelComponent, GroupComponent, LinkageComponent, LinkageDataComponent, EditModelComponent,
    ModelFieldComponent, EditFieldComponent, SiteOptionComponent, ContentComponent, EditCategoryComponent, EditContentComponent,
    FormComponent, FormDetailComponent, EditSiteComponent
];