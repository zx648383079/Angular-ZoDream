import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { PiazzaComponent } from './piazza/piazza.component';

const routes: Routes = [
    {
        path: '',
        component: PiazzaComponent,
    },
    {
        path: 'play/:game',
        component: GameComponent,
        children: [

        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }

export const gameRoutedComponents = [
    GameComponent, PiazzaComponent
];
