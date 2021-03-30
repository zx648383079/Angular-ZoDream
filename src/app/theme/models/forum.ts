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
    path?: IForum[];
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
    path?: IForum[];
    digestable?: boolean;
    highlightable?: boolean;
    closeable?: boolean;
}

export interface IThreadPost {
    id: number;
    content: string;
    user: IUser;
    grade: number;
    created_at: string;
    updated_at?: string;
    deleteable?: boolean;
    html?: any;
}

export interface IForumClassify {
    id: number;
    icon: string;
    name: string;
    position?: number;
    forum_id?: number;
}

