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
import { MessageEditorComponent } from './message-editor/message-editor.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { EditReplyComponent } from './reply/edit/edit-reply.component';
import { ReplyComponent } from './reply/reply.component';
import { ReplyTemplateComponent } from './reply/template/reply-template.component';
import { TemplateCategoryComponent } from './template/category/template-category.component';
import { TemplateEditorComponent } from './template/editor/template-editor.component';
import { TemplateComponent } from './template/template.component';
import { UserComponent } from './user/user.component';
import { WechatBackendComponent } from './wechat-backend.component';
import { CanActivateMainId } from './wid.guard';

const routes: Routes = [
    {
        path: 'user',
        canActivate: [CanActivateMainId],
        component: UserComponent,
    },
    {
        path: 'reply',
        canActivate: [CanActivateMainId],
        component: ReplyComponent,
    },
    {
        path: 'reply/template',
        canActivate: [CanActivateMainId],
        component: ReplyTemplateComponent,
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
        canActivate: [CanActivateMainId],
        component: QrcodeComponent,
    },
    {
        path: 'media/create',
        canActivate: [CanActivateMainId],
        component: EditNewsComponent,
    },
    {
        path: 'media/edit/:id',
        canActivate: [CanActivateMainId],
        component: EditNewsComponent,
    },
    {
        path: 'media',
        canActivate: [CanActivateMainId],
        component: MediaComponent,
    },
    {
        path: 'menu',
        canActivate: [CanActivateMainId],
        component: MenuComponent,
    },
    {
        path: 'log',
        canActivate: [CanActivateMainId],
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
    MenuComponent, MediaComponent, TemplateComponent, ReplyComponent, UserComponent, EditMediaComponent, EditReplyComponent, 
    MessageEditorComponent, EditNewsComponent, TemplateEditorComponent,
    QrcodeComponent, ReplyTemplateComponent, TemplateCategoryComponent
];