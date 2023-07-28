import { Observable } from 'rxjs';
import { IPoint } from '../../theme/utils/canvas';
import { IItem } from '../../theme/models/seo';
import { InjectionToken } from '@angular/core';
import { IErrorResponse, IPage, IPageQueries } from '../../theme/models/page';

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

export interface IGamePeople {
    name: string;
    avatar?: string;
}

export interface IGameDescent {
    id: number;
    name: string;
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
    equip_items?: IGameEquipItem[];
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

export interface IGameEquipItem {
    type: number;
    item?: IGameBagItem;
}

export interface IGameItem {
    id: number;
    name: string;
    icon: string;
    type: number;
    sub_type: number;
    description: string;
    price?: number;
    quality?: number;
}

export interface IGameBagItem extends IGameItem {
    amount: number;
    level?: number;
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

export interface IGameMapDungeon {
    id: number;
    map_id: number;
    name: string;
    cover?: string;
    grade?: number;
    boss_items?: string[];
    output_items?: IGameItem[];
}

export interface IGameMap extends IPoint {
    id: number;
    area_id: number;
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

export interface IGameStoreItem {
    id: number;
    name: string;
    thumb: string;
    amount: number;
    price: number;
    type: number;
}

export interface IGamePrizeItem {
    id: number;
    name: string;
    thumb: string;
    amount: number;
    type: number;
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
    editable?: boolean;
    user_items?: IGamePeople[];
}

export interface IGameOrganize {
    id: number;
    name: string;
    grade: number;
}

export interface IGameMessage {
    id: number;
    content: string;
    created_at: string;
    user: IGamePeople
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
    Mine = 'mine',
    Bank = 'bank',
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
    DescentQuery = 'descent_query',
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
    TeamCreateOwn = 'team_create_own',
    TeamDisbandOwn = 'team_disband_own',
    TeamExcludeOwn = 'team_exclude_own',
    MapDungeonQuery = 'map_dungeon_query',
    MapMove = 'map_move_own',
    MapInquire = 'map_inquire_own',
    MapBattle = 'battle_own',
    MapPick = 'map_pick_own',
    OrganizeQuery = 'org_query',
    OrganizeOwn = 'org_own',
    OrganizeCreateOwn = 'org_create_own',
    OrganizeUpdateOwn = 'org_update_own',
    OrganizeExcludeOwn = 'org_exclude_own',
    OrganizeDisbandOwn = 'org_disband_own',
    OrganizeExitOwn = 'org_exit_own',
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

export const InvestTabItems: IItem[] = [
    {name: '农场', value: GameScenePath.Farm},
    {name: '牧场', value: GameScenePath.Ranch},
    {name: '矿场', value: GameScenePath.Mine},
    {name: '钱庄', value: GameScenePath.Bank},
];


export interface GameCommandListeners {
    [GameCommand.Query]: (data: any) => string[];
    [GameCommand.DescentQuery]: () => IGameDescent[];
    [GameCommand.CharacterQuery]: () => IGameCharacter[];
    [GameCommand.IdentityQuery]: () => IGameCharacterIdentity[];
    [GameCommand.CharacterCreate]: (data: any) => IGameCharacter;
    [GameCommand.CharacterNow]: () => IGameCharacter;
    [GameCommand.ChatPublic]: () => IGameMessage[];
    [GameCommand.CheckinOwn]: () => string[];
    [GameCommand.UpgradeOwn]: () => boolean;
    [GameCommand.BagQuery]: (data: IPageQueries) => IPage<IGameBagItem>;
    [GameCommand.CharacterStatus]: () => IGameCharacter;
    [GameCommand.MessageOwn]: () => any;
    [GameCommand.FarmQuery]: () => any[];
    [GameCommand.MapMove]: (data?: {map: number}) => any;
    [GameCommand.MapPick]: (data: any) => string[];
    [GameCommand.MapInquire]: (data: any) => {
        command: string;
        data: any
    };
    [GameCommand.MapDungeonQuery]: () => IGameMapDungeon[];
    [GameCommand.OrganizeOwn]: () => any;
    [GameCommand.OrganizeQuery]: (data: IPageQueries) => IPage<IGameOrganize>;
    [GameCommand.OrganizeStoreQuery]: (data: IPageQueries) => IPage<IGameItem>;
    [GameCommand.PrizeOwn]: (data: any) => any;
    [GameCommand.RanchQuery]: () => any;
    [GameCommand.StoreQuery]: (data: IPageQueries) => IPage<IGameItem>;
    [GameCommand.TaskOwn]: (data: IPageQueries) => IPage<IGameTask>;
    [GameCommand.TeamOwn]: () => IGameTeam;
    [GameCommand.TeamQuery]: (data: IPageQueries) => IPage<IGameTeam>;
    [GameCommand.TeamCreateOwn]: (data: any) => IGameTeam;
    [GameCommand.TeamDisbandOwn]: () => boolean;
    [GameCommand.TeamExcludeOwn]: (data: {user: number}) => boolean;
    [GameCommand.OrganizeQuery]: (data: IPageQueries) => IPage<IGameOrganize>;
    [GameCommand.OrganizeCreateOwn]: (data: any) => IGameOrganize;
    [GameCommand.OrganizeUpdateOwn]: (data: any) => IGameOrganize;
    [GameCommand.OrganizeDisbandOwn]: () => boolean;
    [GameCommand.OrganizeExcludeOwn]: (data: {user: number}) => boolean;
    [GameCommand.OrganizeExitOwn]: () => boolean;
    [GameCommand.MapBattle]: (data: any) => {
        enemy: any;
        own: any;
        log_items: any[];
    };
}

export interface IGmeRoute {
    name: string;
    path: string;
    disabled?: boolean;
    count?: number;
}

export interface IGameResponse<T = any> {
    command: string;
    data?: T;
    message?: string;
}

export interface IGameScene {

}

export const GameRouterInjectorToken = new InjectionToken<IGameRouter>('game.router');


export interface IGameRouter {
    project: IGameProject;
    character: IGameCharacter;
    params?: any; // 跳转路由传递的值
    request<E extends keyof GameCommandListeners>(command: E, data?: Parameters<GameCommandListeners[E]>[0]): Observable<IGameResponse<ReturnType<GameCommandListeners[E]>>>;
    // request(command: string, data?: any): Observable<IGameResponse>;
    request<E extends GameCommandListeners>(data: {
        [C in keyof E]?: Parameters<E[C]>[0] | Object
    }): Observable<{
        [C in keyof E]: IGameResponse<ReturnType<E[C]>>
    }>;
    // request(command: any, data?: any): any;
    execute(command: string, data?: any): void;
    navigate(path: string, data?: any): void;
    navigateReplace(path: string, data?: any): void;
    navigateBack(): void;
    enter(character: number): void;
    exit(): void;
    toast(items: string[]): void;
    toast(msg: string): void;
    toast(msg: IErrorResponse): void;
    confirm(msg: string): Observable<void>;
    select(items: string[]): Observable<number>;
    say(content: string[]|string, user?: IGamePeople): Observable<void>;
}