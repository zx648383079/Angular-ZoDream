import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameMakerRoutingModule, gameMakerRoutedComponents } from './routing.module';
import { GameMakerService } from './game-maker.service';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreFormModule } from '../../../components/form';
import { DialogModule } from '../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        DialogModule,
        GameMakerRoutingModule
    ],
    declarations: [	...gameMakerRoutedComponents],
    providers: [
        GameMakerService
    ]
})
export class GameMakerModule { }
