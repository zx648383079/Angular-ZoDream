import { IUser } from './user';

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

export interface IReport {
    id: number;
    name: string;
    email: string;
    ip: string;
    item_type: number;
    item_id: number;
    type: number;
    title: string;
    content: string;
    status: number;
    files: string[];
    created_at: string;
    updated_at: string;
    user?: IUser;
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
    value: string|number;
    position: number;
    items?: any[];
    itemKey?: any;
    values?: any[];
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

export interface IBlackWord {
    id: number;
    words: string;
    replace_words: string;
}

export interface IEmoji {
    id: number;
    name: string;
    type: number;
    content: string;
    cat_id: number;
    category: IEmojiCategory;
}

export interface IEmojiCategory {
    id: number;
    name: string;
    icon: string;
    items?: IEmoji[];
}

export interface IAgreement {
    id: number;
    name: string;
    title: string;
    description: string;
    status: number;
    content: IAgreementGroup[];
    created_at: string;
    updated_at?: string;
}


export interface IAgreementGroup {
    name: string;
    title: string;
    children: {
        content: string;
        b?: boolean;
    }[];
}


export interface ISortItem extends IItem {
    asc?: boolean;
}