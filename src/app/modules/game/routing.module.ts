import { NgModule, Type } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { PiazzaComponent } from './piazza/piazza.component';
import { BagComponent } from './pages/bag/bag.component';
import { BattleComponent } from './pages/battle/battle.component';
import { ChatComponent } from './pages/chat/chat.component';
import { DialogueComponent } from './pages/dialogue/dialogue.component';
import { FarmComponent } from './pages/farm/farm.component';
import { MainComponent } from './pages/main/main.component';
import { MapComponent } from './pages/map/map.component';
import { OrganizeComponent } from './pages/organize/organize.component';
import { PrizeComponent } from './pages/prize/prize.component';
import { RanchComponent } from './pages/ranch/ranch.component';
import { StoreComponent } from './pages/store/store.component';
import { TaskComponent } from './pages/task/task.component';
import { CharacterPanelComponent } from './pages/character-panel/character-panel.component';
import { MapLevelComponent } from './pages/map/level/map-level.component';
import { EntryComponent } from './pages/entry/entry.component';
import { GameScenePath, IGameScene } from './model';
import { MailComponent } from './pages/mail/mail.component';

const routes: Routes = [
    {
        path: '',
        component: PiazzaComponent,
    },
    {
        path: 'play/:game',
        component: GameComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }

export const gameRoutedComponents = [
    GameComponent, PiazzaComponent, BagComponent, BattleComponent, ChatComponent, DialogueComponent, FarmComponent, MainComponent, MapComponent, OrganizeComponent, PrizeComponent, RanchComponent, StoreComponent, TaskComponent, CharacterPanelComponent, MapLevelComponent, EntryComponent, MailComponent
];

export const GameSceneItems: {
    [path: string]: Type<IGameScene>
} = {
    [GameScenePath.Entry]: EntryComponent,
    [GameScenePath.Bag]: BagComponent,
    [GameScenePath.Battle]: BattleComponent,
    [GameScenePath.Character]: CharacterPanelComponent,
    [GameScenePath.Chat]: ChatComponent,
    [GameScenePath.Farm]: FarmComponent,
    [GameScenePath.Main]: MainComponent,
    [GameScenePath.Map]: MapComponent,
    [GameScenePath.Organize]: OrganizeComponent,
    [GameScenePath.Ranch]: RanchComponent,
    [GameScenePath.Store]: StoreComponent,
    [GameScenePath.Task]: TaskComponent,
    [GameScenePath.Mail]: MailComponent,
};