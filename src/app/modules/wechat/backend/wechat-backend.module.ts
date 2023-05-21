import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { wechatBackendRoutingComponents, WechatBackendRoutingModule } from './backend-routing.module';
import { WechatService } from './wechat.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { NgSelectModule } from '@ng-select/ng-select';
import { CanActivateMainId } from './wid.guard';
import { ZreEditorModule } from '../../../components/editor';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        DialogModule,
        WechatBackendRoutingModule,
        ZreFormModule,
        NgSelectModule,
        ZreEditorModule,
    ],
    declarations: [...wechatBackendRoutingComponents],
    providers: [
        WechatService,
        CanActivateMainId,
    ]
})
export class WechatBackendModule { }
