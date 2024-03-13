import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { MessageContainerModule } from '../../components/message-container';
import { BotRoutingModule, botRoutingComponents } from './bot-routing.module';
import { BotService } from './bot.service';

@NgModule({
    imports: [
        CommonModule,
        BotRoutingModule,
        ThemeModule,
        MessageContainerModule,
    ],
    declarations: [...botRoutingComponents],
    providers: [
        BotService,
    ]
})
export class BotModule { }
