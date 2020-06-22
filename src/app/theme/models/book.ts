export interface ICategory {
    id: number;
    name: string;
    book_count?: number;
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

export interface IBookRecord extends IBook {
    author_name: string;
    read_at: number;
    chapter_id: number;
    chapter_title: string;
    process: number;
}
