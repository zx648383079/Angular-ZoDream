import { Observable, Subject } from 'rxjs';
import { IPoint } from '../../theme/utils/canvas';
import { IItem } from '../../theme/models/seo';
import { InjectionToken } from '@angular/core';
import { IErrorResponse } from '../../theme/models/page';

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
    nickname: string;
    grade: number;
    exp: number;
    team_id?: number;
    org_id?: number;
    identity?: IGameCharacterIdentity;
    next_grade?: IGameRuleGrade;
    is_checked?: boolean;
    message_count?: number;
    can_upgrade?: boolean;
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
    price?: number;
}

export interface IGameTask {
    id: number;
    title: string;
    description: string;
    gift: string;
    before: string;

    is_open?: boolean;
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

export interface IGameTeam {
    id: number;
    name: string;
}

export interface IGameOrganize {
    id: number;
    name: string;
    grade: number;
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
    OrganizePiazza = 'org_piazza',
    OrganizeStore = 'org_store',
    Ranch = 'ranch',
    Store = 'store',
    Task = 'task',
    Mail = 'mail',
    Skill = 'skill',
    Team = 'team',
    TeamPiazza = 'team_piazza',
    Prize = 'prize',
    Recharge = 'recharge',
    Setting = 'setting',
}

export enum GameCommand {
    Query = 'query',
    CharacterQuery = 'character_query',
    CharacterCreate = 'character_create',
    CharacterNow = 'character_now_own',
    CharacterStatus = 'character_status_own',
    IdentityQuery = 'identity_query',
    BagQuery = 'bag_own',
    WarehouseQuery = 'warehouse_own',
    CheckinOwn = 'checkin_own',
    UpgradeOwn = 'upgrade_own',
    StoreQuery = 'store_query',
    TaskQuery = 'task_query',
    TaskOwn = 'task_own',
    MailOwn = 'mail_own',
    PrizeOwn = 'prize_own',
    TeamQuery = 'team_query',
    TeamOwn = 'team_own',
    MapDungeonQuery = 'map_dungeon_query',
    MapMove = 'map_move_own',
    MapNpc = 'map_npc_own',
    MapBattle = 'map_battle_own',
    MapPick = 'map_pick_own',
    OrganizeQuery = 'org_query',
    OrganizeOwn = 'org_own',
    OrganizeStoreQuery = 'org_store_own',
    FarmQuery = 'farm_own',
    RanchQuery = 'ranch_own',
    SkillQuery = 'skill_own',
    MessageOwn = 'message_own',
    ChatOwn = 'chat_own',
    ChatPublic = 'chat_public',
    ChatTeam = 'chat_team',
    ChatOrganize = 'chat_org',
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
    project: IGameProject;
    character: IGameCharacter;
    params?: any; // 跳转路由传递的值
    request(command: string, data?: any): Observable<IGameResponse>;
    request(data: {
        [command: string]: any
    }): Observable<{
        [cammand: string]: IGameResponse
    }>;
    request(command: any, data?: any): any;
    execute(command: string, data?: any): void;
    navigate(path: string, data?: any): void;
    navigateReplace(path: string, data?: any);
    navigateBack(): void;
    enter(character: number): void;
    exit(): void;
    toast(msg: string): void;
    toast(msg: IErrorResponse): void;
    confirm(msg: string): Subject<void>;
}