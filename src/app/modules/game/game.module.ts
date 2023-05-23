import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule, gameRoutedComponents } from './routing.module';
import { GameService } from './game.service';

@NgModule({
    imports: [
        CommonModule,
        GameRoutingModule
    ],
    declarations: [...gameRoutedComponents],
    providers: [
        GameService
    ]
})
export class GameModule { }
