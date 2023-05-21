import { IExtraRule } from '../../components/link-rule';
import { IPageEditItem } from '../../theme/models/page';
import { IItem } from '../../theme/models/seo';
import { IUser } from '../../theme/models/user';

export const BLOG_OPEN_KEY = 'b_o_k';

export interface ISubtotal {
    name: string;
    icon: string;
    count: number;
}

export interface IEditOptions {
    languages: string[];
    weathers: IItem[];
    licenses: IItem[];
    tags: ITag[];
    categories: ICategory[];
    open_types: IItem[];
    publish_status: IItem[];
}

export interface IBlog {
    id: number;
    title: string;
    description: string;
    thumb: string;
    type: number;
    language: 'en' | 'zh';
    programming_language: string;
    content?: string;
    comment_count: number;
    recommend_count: number;
    click_count: number;
    created_at: string;
    keywords?: string;
    term_id?: number;
    open_type?: number;
    publish_status?: number;
    open_rule?: string;
    edit_type?: number;
    weather?: string;
    audio_url?: string;
    video_url?: string;
    cc_license?: string;
    comment_status?: number;
    url?: string;
    source_url?: string;
    source_author?: string;
    is_hide?: number;
    is_localization?: boolean;
    seo_title?: string;
    seo_description?: string;
    seo_link?: string;
    is_recommended?: boolean;
    user: IUser;
    term: ICategory;
    tags?: ITag[];
    previous?: IBlog;
    next?: IBlog;
    relation?: IBlog[];
    parent_id?: number;
    can_read?: boolean;
    languages?: IItem[];
}

export interface ICategory {
    id: number;
    name: string;
    thumb: string;
    description: string;
    blog_count: number;
    keywords?: string;
    styles?: string;
    en_name?: string;
}


export interface IArchives {
    year: string;
    children: {
      id: number,
      title: string,
      date: string
    }[];
}

export interface IComment extends IPageEditItem {
    id: number;
    content?: string;
    recommend_count: number;
    parent_id: number;
    user_id: number;
    user: IUser;
    blog_id: number;
    approved: number;
    blog?: IBlog;
    name: string;
    email: string;
    url: string;
    ip: string;
    created_at?: string;
    agree_count?: number;
    disagree_count?: number;
    reply_count?: number;
    position?: number;
    replies?: IComment[];
    extra_rule?: IExtraRule[];
}

export interface ITag {
    id?: number;
    name: string;
    blog_count: number;
    description?: string;
    style?: string;
}

export interface ISearchForm {
    page?: number;
    per_page?: number;
    keywords?: string;
    tag?: string;
    category?: number;
    sort?: 'new' | 'best' | 'hot';
    language?: 'zh' | 'en';
    user?: number;
    programming_language?: string;
}
