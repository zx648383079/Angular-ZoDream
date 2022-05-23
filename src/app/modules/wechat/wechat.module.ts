import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { wechatRoutingComponents, WechatRoutingModule } from './wechat-routing.module';
import { WechatService } from './wechat.service';
import { MessageContainerModule } from '../../components/message-container';

@NgModule({
    imports: [
        CommonModule,
        WechatRoutingModule,
        ThemeModule,
        MessageContainerModule,
    ],
    declarations: [...wechatRoutingComponents],
    providers: [
        WechatService,
    ]
})
export class WechatModule { }
