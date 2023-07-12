import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule, gameRoutedComponents } from './routing.module';
import { GameService } from './game.service';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { MessageContainerModule } from '../../components/message-container';
import { ProgressModule } from '../../components/progress';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        GameRoutingModule,
        ProgressModule,
        MessageContainerModule
    ],
    declarations: [...gameRoutedComponents],
    providers: [
        GameService
    ]
})
export class GameModule { }
