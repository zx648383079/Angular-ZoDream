import { IItem } from './seo';

export interface IUser {
    id: number;
    email?: string;
    mobile?: string;
    name: string;
    avatar: string;
    token?: string;
    birthday?: string;
    sex?: number;
    money?: number;
    status?: number;
    last_at?: string;
    created_at?: string;
    updated_at?: string;
    sex_label?: string;
    roles?: number[];
    checked?: boolean;
    is_admin?: boolean;
    is_verified?: boolean;
    card_items?: IUserCard[];
}

export interface IUserCard {
    id: number;
    name: string;
    icon: string;
    exp: number;
    status: number;
    expired_at: string;
}


export interface IUserStatus extends IUser {
    [key: string]: any;
    bulletin_count: number;
    today_checkin: boolean;
}

export interface IUserItem {
    id: number;
    name: string;
    avatar: string;
}

export const SexItems: IItem[] = [
    {name: $localize `Unkown`, value: 0},
    {name: $localize `Male`, value: 1},
    {name: $localize `Female`, value: 2},

];

