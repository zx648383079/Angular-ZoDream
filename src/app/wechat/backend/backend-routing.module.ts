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
import { EditMenuComponent } from './menu/edit/edit-menu.component';
import { MenuComponent } from './menu/menu.component';
import { MessageEditorComponent } from './message-editor/message-editor.component';
import { EditReplyComponent } from './reply/edit/edit-reply.component';
import { ReplyComponent } from './reply/reply.component';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { TemplateComponent } from './template/template.component';
import { UserComponent } from './user/user.component';
import { WechatBackendComponent } from './wechat-backend.component';

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
        path: 'template',
        component: TemplateComponent,
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
        component: WechatBackendComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WechatBackendRoutingModule {}

export const wechatBackendRoutingComponents = [
    WechatBackendComponent, AccountComponent, EditAccountComponent, LogComponent,
    MenuComponent, MediaComponent, TemplateComponent, ReplyComponent, UserComponent, EditMediaComponent, EditReplyComponent, EditMenuComponent,
    MessageEditorComponent, EditNewsComponent, TemplateEditorComponent,
];