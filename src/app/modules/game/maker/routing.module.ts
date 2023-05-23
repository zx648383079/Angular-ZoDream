import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameMakerComponent } from './game-maker.component';

const routes: Routes = [
    {
        path: '',
        component: GameMakerComponent,
        children: [

        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameMakerRoutingModule { }

export const gameMakerRoutedComponents = [
    GameMakerComponent
];
