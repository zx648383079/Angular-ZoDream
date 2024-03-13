import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { AccountComponent } from './account/account.component';
import { EditAccountComponent } from './account/edit/edit-account.component';
import { LogComponent } from './log/log.component';
import { EditMediaComponent } from './media/edit/edit-media.component';
import { MediaComponent } from './media/media.component';
import { EditNewsComponent } from './media/news/edit-news.component';
import { MenuComponent } from './menu/menu.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { ReplyComponent } from './reply/reply.component';
import { TemplateCategoryComponent } from './template/category/template-category.component';
import { TemplateEditorComponent } from './template/editor/template-editor.component';
import { TemplateComponent } from './template/template.component';
import { UserComponent } from './user/user.component';
import { BotBackendComponent } from './bot-backend.component';

const routes: Routes = [
    {
        path: 'user',
        component: UserComponent,
    },
    {
        path: 'reply',
        component: ReplyComponent,
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
        path: 'qrcode',
        component: QrcodeComponent,
    },
    {
        path: 'media/create',
        component: EditNewsComponent,
    },
    {
        path: 'media/edit/:id',
        component: EditNewsComponent,
    },
    {
        path: 'media',
        component: MediaComponent,
    },
    {
        path: 'menu',
        component: MenuComponent,
    },
    {
        path: 'log',
        component: LogComponent,
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
    BotBackendComponent, AccountComponent, EditAccountComponent, LogComponent,
    MenuComponent, MediaComponent, TemplateComponent, ReplyComponent, UserComponent, EditMediaComponent, 
    EditNewsComponent, TemplateEditorComponent,
    QrcodeComponent, TemplateCategoryComponent,
];