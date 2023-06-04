export interface IGameProject {
    id: number;
    name: string;
    logo: string;
    description: string;
}

export interface IGameCharacter {
    id: number;
    name: string;
}

export interface IGameIndigenous {
    id: number;
    name: string;
}

export interface IGameItem {
    id: number;
    name: string;
}

export interface IGameTask {
    id: number;
    name: string;
}

export interface IGameMap {
    id: number;
    name: string;
}

export interface IGameMine {
    id: number;
    name: string;
}

export interface IGameFinancial {
    id: number;
    name: string;
}

export interface IGameRuleGrade {
    id: number;
    name: string;
    grade: number;
    exp: number;
}