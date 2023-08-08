import { IPageEditItem } from './page';
import { IUser } from './user';

export interface ILink {
    name: string;
    url: string;
    logo?: string;
    description?: string;
}

export interface IItem {
    name: string;
    value: any;
    id?: number;
    checked?: boolean;
}

export interface IFriendLink extends IPageEditItem {
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

export interface IFeedback extends IPageEditItem {
    id: number;
    name: string;
    email: string;
    phone: string;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
    open_status: number;
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

export interface ISystemOption extends Record<string, any> {
    name:             string;
    version:          string;
    logo:             string;
    site_title:       string;
    site_keywords:    string;
    site_description: string;
    site_logo:        string;
    site_close:       boolean;
    site_close_tip:   string;
    site_close_retry: string;
    site_icp_beian:   string;
    site_pns_beian:   string;
    site_gray:        boolean;
    micro_time_limit: string;
    auth_register:    number;
    auth_oauth: boolean;
    blog_list_view:   number;
    today_wallpaper: {
        title: string;
        url: string;
        m_url: string;
    }[];
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
    language: string;
    description: string;
    status: number;
    content: IAgreementGroup[];
    created_at: string;
    updated_at?: string;
    languages?: IItem[];
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

export interface IScoreSubtotal {
    total: number;
    good: number;
    middle: number;
    bad: number;
    avg: number; // 平均的得分
    favorable_rate: number; // 好评率
    tags: {
        name: 'good'|'middle'|'bad';
        label: string;
        count: number;
    }[];
}