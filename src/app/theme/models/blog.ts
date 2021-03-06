import { IUser } from './user';

export interface ISubtotal {
    name: string;
    icon: string;
    count: number;
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
    seo_title?: string;
    seo_description?: string;
    seo_link?: string;
    user: IUser;
    term: ICategory;
    tags?: ITag[];
    previous?: IBlog;
    next?: IBlog;
    relation?: IBlog[];
    parent_id?: number;
    languages?: {
        id: number;
        label: string;
        language: string;
    }[];
}

export interface ICategory {
    id: number;
    name: string;
    thumb: string;
    description: string;
    blog_count: number;
    keywords?: string;
    styles?: string;
}


export interface IArchives {
    year: string;
    children: {
      id: number,
      title: string,
      date: string
    }[];
}

export interface IComment {
    id: number;
    content?: string;
    recommend_count: number;
    user: IUser;
    blog_id: number;
    blog?: IBlog;
    name: string;
    email: string;
    created_at?: string;
    agree_count?: number;
    disagree_count?: number;
    position?: number;
    replies?: IComment[];
}

export interface ITag {
    id?: number;
    name: string;
    count: number;
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
