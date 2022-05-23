import { IExtraRule } from '../../components/link-rule';
import { IUser } from '../../theme/models/user';


export interface ICategory {
    id: number;
    name: string;
    icon: string;
    parent_id: number;
}

export interface ITag {
    id: number;
    name: string;
}

export interface IComment {
    id: number;
    user: IUser;
    content: string;
    agree_count?: number;
    disagree_count?: number;
    reply_count?: number;
    extra_rule?: IExtraRule[];
    created_at: string;
}