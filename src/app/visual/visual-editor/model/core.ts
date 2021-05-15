export interface ISize {
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IBound extends ISize, IPoint {
}

export interface IActionItem {
    id: string|number;
    event: any;
    data: any;
}

export interface IResetEvent {
    main: IBound;
    zoom: IBound;
}

export interface IRuleLine {
    value: number;
    label: string|number;
    horizontal?: boolean;
}