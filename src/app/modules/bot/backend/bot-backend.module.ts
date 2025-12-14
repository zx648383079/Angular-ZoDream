import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { BotBackendRoutingModule, botBackendRoutingComponents } from './backend-routing.module';
import { BotService } from './bot.service';
import { DesktopModule } from '../../../components/desktop';
import { TabletModule } from '../../../components/tablet';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DialogModule,
        DesktopModule,
        TabletModule,
        BotBackendRoutingModule,
        ZreFormModule,
        NgSelectModule,
        ZreEditorModule,
    ],
    declarations: [...botBackendRoutingComponents],
    providers: [
        BotService,
    ]
})
export class BotBackendModule { }
