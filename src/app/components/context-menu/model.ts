export interface IMenuButton {
    name: string;
    icon?: string;
    data?: any;
    children?: IMenuItem[];
    expand?: boolean;
    disabled?: boolean;
    onTapped?: () => void;
}

export type IMenuItem = Partial<IMenuButton>;

export type MenuEvent = (item: IMenuButton) => void;
