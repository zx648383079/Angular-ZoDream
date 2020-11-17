import { IUser } from "./user";

export interface ICategory {
    id: number;
    name: string;
    book_count?: number;
    thumb?: string;
}

export interface IAuthor {
    id: number;
    name: string;
    book_count?: number;
}

export interface IBook {
    id: number;
    name?: string;
    cover?: number;
    description?: string;
    size?: number;
    click_count?: number;
    classify?: number;
    chapter_count?: number;
    over_at?: number;
    updated_at?: string;
    category?: ICategory;
    author?: IAuthor;
    last_chapter?: IChapter;
    first_chapter?: IChapter;
}

export interface IChapter {
    id: number;
    title?: string;
    size?: number;
    content?: string;
    book_id?: number;
    previous?: IChapter;
    next?: IChapter;
    created_at: string;
}

export interface IBookList {
    user: IUser;
    items: IBookListItem[];
    id: number;
    user_id: number;
    title: string;
    description: string;
    book_count: number;
    click_count: number;
    collect_count: number;
    created_at: string;
    updated_at: string;
}

export interface IBookListItem {
    book: IBook;
    id?: number;
    list_id?: number;
    book_id: number;
    remark: string;
    star: number;
    agree?: number;
    disagree?: number;
    created_at?: string;
    updated_at?: string;
}

export interface IBookRecord extends IBook {
    author_name: string;
    read_at: number;
    chapter_id: number;
    chapter_title: string;
    process: number;
}
