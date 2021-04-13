import { IUser } from '../theme/models/user';

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
    avatar?: string;
    description?: string;
}

export interface IBook {
    id: number;
    name?: string;
    source?: string;
    cat_id?: number;
    author_id?: number;
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
    on_shelf?: boolean;
}

export interface IChapter {
    id: number;
    title?: string;
    size?: number;
    content?: string;
    price?: number;
    source?: string;
    position?: number;
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
    is_collected: boolean;
}

export interface IBookListItem {
    book: IBook;
    id?: number;
    list_id?: number;
    book_id: number;
    remark: string;
    star: number;
    agree_count?: number;
    disagree_count?: number;
    is_agree?: number;
    on_shelf?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface IBookRecord extends IBook {
    author_name: string;
    read_at: number;
    book?: IBook,
    chapter?: IChapter;
    chapter_id: number;
    book_id: number;
    process: number;
}