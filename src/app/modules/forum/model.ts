import { IUser } from '../../theme/models/user';

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
    min?: boolean;
    thread_top?: IThread[];
    today_count?: number;
}

export interface IThread {
    id: number;
    title: string;
    view_count: number;
    post_count: number;
    is_highlight?: boolean;
    is_digest?: boolean;
    is_closed?: boolean;
    top_type?: number;
    created_at: string;
    updated_at: string;
    user: IUser;
    forum_id: number;
    forum?: IForum;
    path?: IForum[];
    editable?: boolean;
    digestable?: boolean;
    highlightable?: boolean;
    closeable?: boolean;
    topable?: boolean;
    last_post?: IThreadPost;
    is_new?: boolean;
    classify?: IForumClassify;
    content?: string;
    is_private_post?: number;
    classify_id?: number;
    like_type?: -1|1|2;
    is_collected?: boolean;
    is_reward?: boolean;
    reward_items?: IThreadLog[];
    reward_count?: number;
}

export interface IThreadPost {
    id: number;
    content: string;
    user_id: number;
    user: IThreadUser;
    grade: number;
    created_at: string;
    updated_at?: string;
    deleteable?: boolean;
    is_public_post?: boolean;
    html?: any;
    status?: number;
    is_loaded?: boolean; // 是否加载了完整的用户统计信息
    is_hover_user?: boolean;
}

export interface IForumClassify {
    id: number;
    icon: string;
    name: string;
    position?: number;
    forum_id?: number;
}


export interface IThreadUser extends IUser {
    medal_items: {
        name: string;
        icon: string;
    }[];
    count_items: {
        name: string;
        count: number;
    }[];
}

export interface IThreadLog {
    id: number;
    data: any;
    user?: IUser;
    created_at: string;
}
