import { Observable, Subject } from 'rxjs';
import { IPoint } from '../../theme/canvas';
import { IItem } from '../../theme/models/seo';
import { InjectionToken } from '@angular/core';

export const ItemTypeItems: IItem[] = [
    {name: '杂物', value: 0},
    {name: '武器', value: 1},
    {name: '材料', value: 2},
    {name: '食材', value: 3},
    {name: '道具', value: 4},
];
export const TaskTypeItems: IItem[] = [
    {name: '默认', value: 0},
    {name: '今日任务', value: 1},
    {name: '活动任务', value: 2},
];

export interface IGameBattleProperty {
    hp: number;
    mp: number;
    att: number;
    def: number;
}

export interface IGameProject {
    id: number;
    name: string;
    logo: string;
    description: string;
    status?: number;
}

export interface IGameCharacter extends IGameBattleProperty {
    id: number;
    name: string;
}

export interface IGameCharacterIdentity extends IGameBattleProperty {
    id: number;
    name: string;
    image: string;
    description: string;
}

export interface IGameIndigenous extends IGameBattleProperty {
    id: number;
    name: string;
    avatar: string;
    description: string;
}

export interface IGameItem {
    id: number;
    name: string;
    icon: string;
    description: string;
}

export interface IGameTask {
    id: number;
    title: string;
    description: string;
    gift: string;
    before: string;
}

export interface IGameMapArea {
    id: number;
    parent_id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IGameMap extends IPoint {
    id: number;
    map_id: number;
    name: string;
    description: string;

    south_id?: number;
    east_id?: number;
    north_id?: number;
    west_id?: number;
    is_selected?: boolean;
    items?: IGameIndigenous[];
}

export interface IGameMapItem {
    id: number;
    map_id: number;
    item_type: number;
    item_id: number;
    amount: number;
    refresh_time: number;
    item?: IGameItem|IGameIndigenous;
}

export interface IGameMine {
    id: number;
    name: string;
}

export interface IGameSkill {
    id: number;
    name: string;
    icon: string;
    description: string;
}

export interface IGameFinancial {
    id: number;
    name: string;
}

export interface IGameFarmPlot {
    id: number;
    index: number;
    grade: number;
    grade_alias: string;
    price: number;
    time_scale: number;
    yield_scale: number;
    upgrade_rules: IGameFarmPlot[];
}

export interface IGameRuleGrade {
    id: number;
    name: string;
    grade: number;
    exp: number;
}


export enum GameScenePath {
    Entry = 'entry',
    Bag = 'bag',
    Battle = 'battle',
    Character = 'character',
    Chat = 'chat',
    Farm = 'farm',
    Main = 'main',
    Map = 'map',
    MapGlobe = 'map_globe',
    MapLevel = 'map_level',
    Organize = 'org',
    Ranch = 'ranch',
    Store = 'store',
    Task = 'task',
    Mail = 'mail',
    Skill = 'skill',
    Prize = 'prize',
    Recharge = 'recharge',
    Setting = 'setting',
}

export interface IGmeRoute {
    name: string;
    path: string;
    disabled?: boolean;
    count?: number;
}

export interface IGameResponse {
    command: string;
    data?: any;
    message?: string;
}

export interface IGameScene {

}

export const GameRouterInjectorToken = new InjectionToken<IGameRouter>('game.router');

export interface IGameRouter {
    request(command: string, data?: any): Observable<IGameResponse>;
    execute(command: string, data?: any): void;
    navigate(path: string, data?: any): void;
    navigateBack(): void;
    enter(character: number): void;
    exit(): void;
    toast(msg: string): void;
    confirm(msg: string): Subject<void>;
}