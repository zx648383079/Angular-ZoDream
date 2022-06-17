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
}

export interface ISoftwareVersion {
    id: number;
    name: string;
    description: string;
    created_at?: string;
    app_id: number;
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