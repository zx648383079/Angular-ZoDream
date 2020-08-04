import { IUser } from './user';

export interface IBulletinUser {
    id: number;
    bulletin_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    bulletin: IBulletin;
}

export interface IBulletin {
    id: number;
    title: string;
    content: string;
    type: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user?: IUser;
    user_name: string;
    icon: string;
}

export interface IConnect {
    id?: number;
    vendor?: string;
    nickname?: string;
    created_at?: string;
    name?: string;
    icon?: string;
}

export interface IDriver {
    id?: number;
    name: string;
    created_at: string;
}

export interface IAccountLog {
    id?: number;
    type?: number;
    item_id?: number;
    money?: number;
    status?: number;
    remark: string;
    created_at?: string;
}

export interface ILoginLog {
    id: number;
    ip: string;
    user_id: number;
    user: string;
    status: number;
    mode: string;
    created_at: string;
}


export interface ILogin {
    email?: string;
    password?: string;
    mobile?: string;
    code?: string;
}

export interface IRegister {
    name: string;
    email?: string;
    password?: string;
    mobile?: string;
    code?: string;
    confirm_password?: string;
    agree: boolean;
}

export interface IRole {
    id: number;
    name: string;
    display_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface IPermission {
    id: number;
    name: string;
    display_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

