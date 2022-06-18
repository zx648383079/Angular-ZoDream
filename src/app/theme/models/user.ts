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
}

export interface IUserItem {
    id: number;
    name: string;
    avatar: string;
}

