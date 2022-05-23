import { IExtraRule } from '../../components/link-rule';
import { IUser } from '../../theme/models/user';


export interface ISoftware {
    id: number;
    name: string;
    keywords: string,
    content: string,
    description: string,
    cat_id: number,
    icon: string,
    is_free: boolean,
    is_open_source: boolean,
    official_website: string,
    git_url: string,
    score: number,
    updated_at: string;
    created_at: string;
    tags?: ITag[];
    user?: IUser;
    category?: ICategory;
}

export interface ISoftwareVersion {
    id: number;
    name: string;
}

export interface ISoftwarePackage {
    id: number;
}

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