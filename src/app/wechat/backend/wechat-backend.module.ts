import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { wechatBackendRoutingComponents, WechatBackendRoutingModule } from './backend-routing.module';
import { WechatService } from './wechat.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        DialogModule,
        WechatBackendRoutingModule
    ],
    declarations: [...wechatBackendRoutingComponents],
    providers: [
        WechatService,
    ]
})
export class WechatBackendModule { }
