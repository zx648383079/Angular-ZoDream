import { IExtraRule } from '../../components/link-rule';
import { IUser } from '../../theme/models/user';

export interface IMicro {
    id: number;
    content: string;
    extra_rule: IExtraRule[];
    recommend_count: number;
    forward_count: number;
    comment_count: number;
    collect_count: number;
    created_at: string;
    user_id: number;
    source?: string;
    status?: number;
    is_recommended?: boolean;
    is_collected?: boolean;
    editable?: boolean;
    comment_open?: boolean;
    forward?: IMicro;
    attachment?: IAttachment[];
    user: IUser;
}

export interface IAttachment {
    thumb: string;
    type: number;
    file: string;
}

export interface IComment {
    id?: number;
    content: string;
    extra_rule: IExtraRule[];
    agree: number;
    disagree: number;
    created_at: string;
    agree_type?: 0 | 3 | 4;
    user: IUser;
    replies?: IComment[];
    reply_count?: number;
}

export interface ITopic {
    id: number;
    name: string;
    micro_count?: number;
}
