import { IExtraRule } from '../../components/link-rule';
import { IUser } from '../../theme/models/user';

export interface IResource {
    id: number;
    title: string;
    keywords: string,
    thumb: string;
    content: string,
    description: string,
    cat_id: number,
    size: number;
    type: number;
    price: number;
    is_commercial: number;
    is_reprint: number;
    updated_at: string;
    created_at: string;
    download_count: number;
    view_count: number;
    comment_count: number;
    tags?: ITag[];
    user?: IUser;
    category?: ICategory;
    files?: IResourceFile[];
}

export interface IResourceFile {
    id: number;
    res_id: number;
    file_type: number;
    file: string;
    created_at: string;
    click_count: number;
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