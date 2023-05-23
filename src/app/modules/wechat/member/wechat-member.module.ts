import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { WechatMemberRoutingModule, wechatMemberRoutingComponents } from './routing.module';
import { WechatService } from './wechat.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        DialogModule,
        WechatMemberRoutingModule,
        ZreFormModule,
        NgSelectModule,
        ZreEditorModule,
    ],
    declarations: [...wechatMemberRoutingComponents],
    providers: [
        WechatService,
    ]
})
export class WechatBackendModule { }
