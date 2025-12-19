import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { MessageContainerModule } from '../../components/message-container';
import { BotRoutingModule, botRoutingComponents } from './bot-routing.module';
import { BotService } from './bot.service';
import { DesktopModule } from '../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        Field,
        BotRoutingModule,
        ThemeModule,
        DesktopModule,
        MessageContainerModule,
    ],
    declarations: [...botRoutingComponents],
    providers: [
        BotService,
    ]
})
export class BotModule { }
