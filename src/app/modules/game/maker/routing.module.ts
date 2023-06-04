import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameMakerComponent } from './game-maker.component';
import { HomeComponent } from './home/home.component';
import { CharacterComponent } from './character/character.component';
import { IndigenousComponent } from './indigenous/indigenous.component';
import { ItemComponent } from './item/item.component';
import { MapComponent } from './map/map.component';
import { RuleGradeComponent } from './rule/grade/rule-grade.component';
import { TaskComponent } from './task/task.component';
import { TaskDialogueComponent } from './task/dialogue/task-dialogue.component';
import { RuleFarmComponent } from './rule/farm/rule-farm.component';
import { RuleCheckinComponent } from './rule/checkin/rule-checkin.component';
import { RulePrizeComponent } from './rule/prize/rule-prize.component';
import { RuleRanchComponent } from './rule/ranch/rule-ranch.component';
import { RuleStoreComponent } from './rule/store/rule-store.component';
import { GameListComponent } from './list/game-list.component';
import { MineComponent } from './mine/mine.component';
import { FinancialComponent } from './financial/financial.component';

const routes: Routes = [
    {
        path: ':game',
        component: GameMakerComponent,
        children: [
            {
                path: 'character',
                component: CharacterComponent,
            },
            {
                path: 'indigenous',
                component: IndigenousComponent,
            },
            {
                path: 'item',
                component: ItemComponent,
            },
            {
                path: 'map',
                component: MapComponent,
            },
            {
                path: 'mine',
                component: MineComponent,
            },
            {
                path: 'financial',
                component: FinancialComponent
            },
            {
                path: 'rule/grade',
                component: RuleGradeComponent,
            },
            {
                path: 'rule/farm',
                component: RuleFarmComponent,
            },
            {
                path: 'rule/checkin',
                component: RuleCheckinComponent,
            },
            {
                path: 'rule/prize',
                component: RulePrizeComponent,
            },
            {
                path: 'rule/ranch',
                component: RuleRanchComponent,
            },
            {
                path: 'rule/store',
                component: RuleStoreComponent,
            },
            {
                path: 'task/:task',
                component: TaskDialogueComponent,
            },
            {
                path: 'task',
                component: TaskComponent,
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
export class GameMakerRoutingModule { }

export const gameMakerRoutedComponents = [
    GameMakerComponent, HomeComponent, TaskComponent, TaskDialogueComponent, RuleGradeComponent, MapComponent, ItemComponent, IndigenousComponent,
    CharacterComponent, RuleFarmComponent, RuleCheckinComponent, RulePrizeComponent, RuleRanchComponent, RuleStoreComponent, GameListComponent, FinancialComponent, MineComponent
];
