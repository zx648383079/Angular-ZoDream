import { IPoint } from '../../theme/canvas';
import { IItem } from '../../theme/models/seo';

export const ItemTypeItems: IItem[] = [
    {name: '杂物', value: 0},
    {name: '武器', value: 1},
    {name: '材料', value: 2},
    {name: '食材', value: 3},
    {name: '道具', value: 4},
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
    name: string;
    icon: string;
    description: string;
}

export interface IGameMapArea {
    id: number;
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