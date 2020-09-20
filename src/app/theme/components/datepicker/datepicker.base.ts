export interface IDay {
    disable: boolean;
    selected: boolean;
    val: number;
}

export enum DayMode {
    Day = 0,
    Year = 1,
    Hour = 2
}
