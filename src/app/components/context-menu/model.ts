export interface IMenuButton {
    name: string;
    icon?: string;
    data?: any;
    children?: IMenuItem[];
    expand?: boolean;
    disable?: boolean;
    onTapped?: () => void;
}

export interface IMenuDivide {
}

export type IMenuItem = IMenuButton | IMenuDivide;

export type MenuEvent = (item: IMenuButton) => void;
