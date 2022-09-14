import { IExtraRule } from '../../components/link-rule';
import { IItem } from '../../theme/models/seo';
import { IUser } from '../../theme/models/user';

export const FileTypeItems: IItem[] = [
    {name: '文件', value: 0},
    {name: '网址', value: 1},
    {name: '网盘', value: 2},
    {name: '种子', value: 3},
];

export interface ISoftware {
    id: number;
    name: string;
    keywords: string,
    content: string,
    description: string,
    cat_id: number,
    icon: string,
    is_free: number,
    is_open_source: number,
    official_website: string,
    git_url: string,
    score: number,
    updated_at: string;
    created_at: string;
    download_count: number;
    view_count: number;
    comment_count: number;
    tags?: ITag[];
    user?: IUser;
    category?: ICategory;
    version?: ISoftwareVersion;
    packages?: ISoftwarePackage[];
}

export interface ISoftwareVersion {
    id: number;
    name: string;
    description: string;
    created_at?: string;
    app_id: number;
    files?: ISoftwarePackage;
}

export interface ISoftwarePackage {
    id: number;
    name: string;
    created_at?: string;
    app_id: number;
    version_id: number;
    os: string;
    framework: string;
    url_type: number;
    url: string;
    size: number;
}

export interface ICategory {
    id: number;
    name: string;
    icon: string;
    parent_id: number;
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
}

export interface ISoftwareLog {
    id: number;
    created_at: string;
    software: ISoftware;
    installed?: boolean;
}

export interface ISoftwareCheck {
    package: ISoftware;
    version: ISoftwareVersion;
    file: ISoftwarePackage;
}

export interface ISoftwareDownload extends ISoftwareCheck {
    status?: number; // 0 未更新 1 下载暂停 2 下载中
    speed?: number;
    length?: number;
    progress?: number;
    last_time?: number;
    style?: any;
}