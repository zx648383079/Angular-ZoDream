export interface IMenuButton {
    name: string;
    icon?: string;
    children?: IMenuItem[];
    expand?: boolean;
    disable?: boolean;
    onTapped?: () => void;
}

export interface IMenuDivide {
}

export type IMenuItem = IMenuButton | IMenuDivide;

export type MenuEvent = (item: IMenuButton) => void;
