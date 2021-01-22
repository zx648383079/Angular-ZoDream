import { IUser } from "./user";

export interface IMusic {
    id: number;
    name: string;
    singer: string;
    path: string;
    status: number;
    duration: number;
    created_at: string;
    updated_at: string;
}

export interface IVideo {
    id: number;
    content: string;
    music?: IMusic;
    cover: string;
    video_path: string;
    video_duration: number;
    video_width: number;
    video_height: number;
    music_offset: number;
    like_count: number;
    comment_count: number;
    status: number;
    created_at: string;
    updated_at: string;
    user?: IUser;
}

export interface IComment {
    id: number;
    user: IUser;
    content: string;
    created_at: string;
    updated_at: string;
}
