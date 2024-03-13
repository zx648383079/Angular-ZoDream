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
import { SendComponent } from './reply/send/send.component';
import { ReplyTemplateComponent } from './reply/template/reply-template.component';
import { TemplateEditorComponent } from './template/editor/template-editor.component';
import { UserGroupComponent } from './user/group/user-group.component';
import { UserComponent } from './user/user.component';
import { BotMemberComponent } from './bot-member.component';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditAccountComponent,
    },
    {
        path: 'create',
        component: EditAccountComponent,
    },
    {
        path: ':wid',
        component: BotMemberComponent,
        children: [
            {
                path: 'user/group',
                component: UserGroupComponent,
            },
            {
                path: 'user',
                component: UserComponent,
            },
            {
                path: 'reply',
                component: ReplyComponent,
            },
            {
                path: 'send',
                component: SendComponent,
            },
            {
                path: 'reply/template',
                component: ReplyTemplateComponent,
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
        ]
    },
    {
        path: '',
        component: AccountComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BotMemberRoutingModule {}

export const botMemberRoutingComponents = [
    BotMemberComponent, AccountComponent, EditAccountComponent, LogComponent,
    MenuComponent, MediaComponent, ReplyComponent, UserComponent, EditMediaComponent, EditReplyComponent, 
    MessageEditorComponent, EditNewsComponent, TemplateEditorComponent,
    QrcodeComponent, ReplyTemplateComponent, UserGroupComponent, SendComponent
];