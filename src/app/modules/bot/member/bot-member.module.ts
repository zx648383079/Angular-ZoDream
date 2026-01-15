import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { BotMemberRoutingModule, botMemberRoutingComponents } from './routing.module';
import { BotService } from './bot.service';
import { DesktopModule } from '../../../components/desktop';
import { TabletModule } from '../../../components/tablet';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DialogModule,
        DesktopModule,
        TabletModule,
        BotMemberRoutingModule,
        ZreFormModule,
        NgSelectModule,
        ZreEditorModule,
    ],
    declarations: [...botMemberRoutingComponents],
    providers: [
        BotService,
    ]
})
export class BotMemberModule { }
