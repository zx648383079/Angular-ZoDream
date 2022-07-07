import { IExtraRule } from '../../components/link-rule';
import { IItem } from '../../theme/models/seo';
import { IUser } from '../../theme/models/user';

export const FileTypeItems: IItem[] = [
    {name: '文件', value: 0},
    {name: '网址', value: 1},
    {name: '网盘', value: 2},
    {name: '种子', value: 3},
]

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

export interface IResourceCatalog {
    type: number;
    icon: string;
    name: string;
    children?: IResourceCatalog[];
    open?: boolean;
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
    is_hot?: number;
    children?: ICategory[];
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
    reply_items?: IComment[];
}