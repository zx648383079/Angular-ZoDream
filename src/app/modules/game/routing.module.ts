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
import { RechargeComponent } from './pages/recharge/recharge.component';
import { SettingComponent } from './pages/setting/setting.component';
import { MapGlobeComponent } from './pages/map/globe/map-globe.component';
import { SkillComponent } from './pages/skill/skill.component';
import { CanActivateViaAuthGuard } from '../../theme/guards';
import { TeamComponent } from './pages/team/team.component';
import { OrganizePiazzaComponent } from './pages/organize/piazza/organize-piazza.component';
import { TeamPiazzaComponent } from './pages/team/piazza/team-piazza.component';
import { OrganizeStoreComponent } from './pages/organize/store/organize-store.component';

const routes: Routes = [
    {
        path: '',
        component: PiazzaComponent,
    },
    {
        canActivate: [CanActivateViaAuthGuard],
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
    GameComponent, PiazzaComponent, BagComponent, BattleComponent, ChatComponent, DialogueComponent, FarmComponent, MainComponent, MapComponent, OrganizeComponent, PrizeComponent, RanchComponent, StoreComponent, TaskComponent, CharacterPanelComponent, MapLevelComponent, EntryComponent, RechargeComponent, SettingComponent, MapGlobeComponent, SkillComponent, TeamComponent, OrganizePiazzaComponent, TeamPiazzaComponent,
    OrganizeStoreComponent
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
    [GameScenePath.MapLevel]: MapLevelComponent,
    [GameScenePath.MapGlobe]: MapGlobeComponent,
    [GameScenePath.Skill]: SkillComponent,
    [GameScenePath.Organize]: OrganizeComponent,
    [GameScenePath.Team]: TeamComponent,
    [GameScenePath.OrganizePiazza]: OrganizePiazzaComponent,
    [GameScenePath.OrganizeStore]: OrganizeStoreComponent,
    [GameScenePath.TeamPiazza]: TeamPiazzaComponent,
    [GameScenePath.Ranch]: RanchComponent,
    [GameScenePath.Store]: StoreComponent,
    [GameScenePath.Task]: TaskComponent,
    [GameScenePath.Prize]: PrizeComponent,
    [GameScenePath.Recharge]: RechargeComponent,
    [GameScenePath.Setting]: SettingComponent,
};