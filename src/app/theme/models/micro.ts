import { IUser } from './user';

export interface IMicro {
    id: number;
    content: string;
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
