import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { wechatBackendRoutingComponents, WechatBackendRoutingModule } from './backend-routing.module';
import { WechatService } from './wechat.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';
import { NgSelectModule } from '@ng-select/ng-select';
import { CanActivateMainId } from './wid.guard';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        DialogModule,
        WechatBackendRoutingModule,
        EditorModule,
        ZreFormModule,
        NgSelectModule,
    ],
    declarations: [...wechatBackendRoutingComponents],
    providers: [
        WechatService,
        CanActivateMainId,
    ]
})
export class WechatBackendModule { }
