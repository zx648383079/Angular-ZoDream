import { IUser } from './user';

export interface IForum {
    id: number;
    name: string;
    thumb: string;
    description: string;
    thread_count: number;
    post_count: number;
    children?: IForum[];
    last_thread?: IThread;
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
}

export interface IThreadPost {
    id: number;
    content: string;
    user: IUser;
    grade: number;
    created_at: string;
    updated_at?: string;
}
