import { IUser } from './user';

export interface IForum {
    id: number;
    name: string;
    thumb: string;
    parent_id?: number;
    description: string;
    thread_count: number;
    post_count: number;
    children?: IForum[];
    last_thread?: IThread;
    type?: number;
    position?: number;
    level?: number;
    classifies?: IForumClassify[];
    moderators?: IUser[];
}

export interface IThread {
    id: number;
    title: string;
    view_count: number;
    post_count: number;
    is_highlight?: boolean;
    is_digest?: boolean;
    is_closed?: boolean;
    created_at: string;
    updated_at: string;
    user: IUser;
    forum?: IForum;
}

export interface IThreadPost {
    id: number;
    content: string;
    user: IUser;
    grade: number;
    created_at: string;
    updated_at?: string;
}

export interface IForumClassify {
    id: number;
    icon: string;
    name: string;
    position?: number;
    forum_id?: number;
}

export interface IBlackWord {
    id: number;
    words: string;
    replace_words: string;
}

export interface IEmoji {
    id: number;
    name: string;
    type: number;
    content: string;
    cat_id: number;
    category: IEmojiCategory;
}

export interface IEmojiCategory {
    id: number;
    name: string;
    icon: string;
}
