import { IUser } from './user';

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
    url?: string;
    source_url?: string;
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
}

export interface ITag {
    name: string;
    count: number;
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
