export interface ILink {
    name: string;
    url: string;
    description?: string;
}

export interface IItem {
    name: string;
    value: string | number;
    checked?: boolean;
}

export interface IFriendLink {
    id: number;
    name: string;
    url: string;
    logo: string;
    brief: string;
    email: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface IFeedback {
    id: number;
    name: string;
    email: string;
    phone: string;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface ISubscribe {
    id: number;
    email: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface IOption {
    id?: number;
    name: string;
    code: string;
    parent_id: number;
    type: string;
    visibility: number;
    default_value: string;
    value: string;
    position: number;
    items?: string[];
    values?: string[];
    children?: IOption[];
}

export interface ISite {
    name: string;
    version: string;
    logo: string;
    qr: string;
    goods: number;
    category: number;
    brand: number;
    currency: string;
}
