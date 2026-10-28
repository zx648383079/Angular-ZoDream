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
    activated_at?: number;
    sex_label?: string;
    roles?: number[];
    zone_id?: number;
    rank_level?: number;
    checked?: boolean;
    is_admin?: boolean;
    is_verified?: boolean;
    card_items?: IUserCard[];
    country?: string;
}

export interface IUserCard {
    id: number;
    name: string;
    icon: string;
    exp: number;
    status: number;
    expired_at: string;
}

export interface IUserZone {
    id: number;
    icon: string;
    name: string;
    decsription: string;
    is_open: number;
    status: number;
}

export interface IUserStatus extends IUser {
    [key: string]: any;
    bulletin_count: number;
    today_checkin: boolean;
    post_count: number;
    following_count: number;
    follower_count: number;
    oauth_count: number;
    parent: {
        id: number;
        name: string;
    };
    rank: {
        level: number;
        exp: number;
        next_exp: number;
    };
    wallet: {
        money: number;
        credits: number;
    };
    login_ip: {
        ip: string;
        count: number;
    };
    last_login: {
        ip: string;
        created_at: string;
    };
    role_items: string[];
    permission_items: string[];
}

export interface IUserItem {
    id: number;
    name: string;
    avatar: string;
}

export interface IUserRank {
    id: number;
    level: number;
    icon: string;
    name: string;
    exp: number;
}

export const SexItems: IItem[] = [
    {name: $localize `Unkown`, value: 0},
    {name: $localize `Male`, value: 1},
    {name: $localize `Female`, value: 2},
];

