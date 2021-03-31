import { IUser } from '../theme/models/user';

export interface IMicro {
    id: number;
    content: string;
    extra_rule: IExtraRule[];
    recommend_count: number;
    forward_count: number;
    comment_count: number;
    collect_count: number;
    created_at: string;
    source?: string;
    is_recommended?: boolean;
    is_collected?: boolean;
    editable?: boolean;
    comment_open?: boolean;
    forward?: IMicro;
    attachment?: IAttachment[];
    user: IUser;
    attachment_open?: boolean;
    attachment_current?: number;
    blcokItems?: IBlockItem[];
}

export interface IAttachment {
    thumb: string;
    file: string;
}

export interface IComment {
    id?: number;
    content: string;
    agree: number;
    disagree: number;
    created_at: string;
    agree_type?: 0 | 3 | 4;
    user: IUser;
    replies?: IComment[];
}

export interface ITopic {
    id: number;
    name: string;
    micro_count?: number;
}

export interface IBlockItem {
    content: string;
    type?: number;
    user?: number; // 2
    topic?: number; // 3
    link?: string; // 4
    image?: string; // 1
}

export interface IExtraRule {
    s: string;    // 字符串
    i?: string;   // 图片链接
    u?: number;   // 用户id
    t?: number;   // 话题id
    l?: string;   // 链接
}