import { IExtraRule } from '../../components/link-rule';
import { IUser } from './user';

export interface IBulletinUser {
    id: number;
    bulletin_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    bulletin: IBulletin;
    open?: boolean;
}

export interface IBulletin {
    id: number;
    title: string;
    content: string;
    extra_rule: IExtraRule[];
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
    type_label?: string;
    status_label?: string;
    user?: IUser;
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
    permissions?: number[];
}

export interface IPermission {
    id: number;
    name: string;
    display_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface IUserRole {
    role?: IRole;
    roles: string[];
    permissions: string[];
}

export interface IApplyLog {
    user?: IUser;
    id: number;
    user_id: number;
    type: number;
    money: number;
    remark: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface IAdminLog {
    user?: IUser;
    id: number;
    ip: string;
    user_id: number;
    item_type: number;
    item_id: number;
    action: string;
    remark: string;
    created_at: string;
}

export interface IActionLog {
    user?: IUser;
    id: number;
    ip: string;
    user_id: number;
    action: string;
    remark: string;
    created_at: string;
}

export interface IBanAccount {
    id: number;
    item_key: string;
    item_type: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface IEquityCard {
    id?: number;
    name: string;
    icon: string;
    status: number;
    created_at?: string;
    updated_at?: string;
    amount?: number;
}

export interface IUserCard {
    id?: number;
    status: number;
    exp: number;
    expired_at: number;
    created_at?: string;
    updated_at?: string;
    card?: IEquityCard;
    user?: IUser;
}

export interface IInviteCode {
    id?: number;
    code: string;
    amount: number;
    invite_count: number;
    expired_at: number;
    created_at?: string;
    updated_at?: string;
    user?: IUser;
}

export interface IInviteLog {
    id?: number;
    code: string;
    created_at?: string;
    user?: IUser;
    inviter?: IUser;
}


