import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { wechatBackendRoutingComponents, WechatBackendRoutingModule } from './backend-routing.module';
import { WechatService } from './wechat.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        DialogModule,
        WechatBackendRoutingModule,
        ZreFormModule,
        NgSelectModule,
    ],
    declarations: [...wechatBackendRoutingComponents],
    providers: [
        WechatService,
    ]
})
export class WechatBackendModule { }
