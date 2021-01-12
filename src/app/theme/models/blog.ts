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
    recommend: number;
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
    user: IUser;
    term: ICategory;
    tags?: ITag[];
    previous?: IBlog;
    next?: IBlog;
    relation?: IBlog[];
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
    blog?: IBlog;
    name: string;
    email: string;
    created_at?: string;
    agree?: number;
    disagree?: number;
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
