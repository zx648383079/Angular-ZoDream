import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { AccountComponent } from './account/account.component';
import { EditAccountComponent } from './account/edit/edit-account.component';
import { TemplateCategoryComponent } from './template/category/template-category.component';
import { TemplateComponent } from './template/template.component';
import { UserComponent } from './user/user.component';
import { BotBackendComponent } from './bot-backend.component';

const routes: Routes = [
    {
        path: 'user',
        component: UserComponent,
    },
    {
        path: 'template/category',
        component: TemplateCategoryComponent,
    },
    {
        path: 'template',
        component: TemplateComponent,
    },
    {
        path: 'account/edit/:id',
        component: EditAccountComponent,
    },
    {
        path: 'account/create',
        component: EditAccountComponent,
    },
    {
        path: 'account',
        component: AccountComponent,
    },
    {
        path: '',
        component: BotBackendComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BotBackendRoutingModule {}

export const botBackendRoutingComponents = [
    BotBackendComponent, AccountComponent, EditAccountComponent, TemplateComponent, UserComponent, TemplateCategoryComponent,
];