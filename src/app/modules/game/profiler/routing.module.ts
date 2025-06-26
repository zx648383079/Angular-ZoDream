import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameProfilerComponent } from './game-profiler.component';
import { ItemComponent } from './item/item.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { GameListComponent } from './list/game-list.component';
import { LotteryComponent } from './lottery/lottery.component';
import { AvatarComponent } from './avatar/avatar.component';

const routes: Routes = [
    {
        path: ':game',
        component: GameProfilerComponent,
        children: [
            {
                path: 'item',
                component: ItemComponent,
            },
            {
                path: 'map',
                component: MapComponent,
            },
            {
                path: 'avatar',
                component: AvatarComponent,
            },
            {
                path: 'lottery',
                component: LotteryComponent,
            },
            {
                path: '',
                component: HomeComponent,
            }
        ]
    },
    {
        path: '',
        component: GameListComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameProfilerRoutingModule { }

export const gameProfilerRoutedComponents = [
    GameProfilerComponent, HomeComponent, GameListComponent, LotteryComponent, MapComponent, ItemComponent, AvatarComponent
];
