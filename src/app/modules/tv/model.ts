import { IExtraRule } from '../../components/link-rule';
import { IUser } from '../../theme/models/user';


export interface ILive {
    id: number;
    title: string;
    thumb: string;
    source: string;
}

export interface IMusic {
    id: number;
    name: string;
    cover: string;
    album: string;
    artist: string;
    duration: number;
}
export interface IMusicFile {
    id: number;
    music_id: number;
    file_type: number;
    file: string;
}

export interface IMovie {
    
}
export interface IMovieFile {

}

export interface IMovieSeries {

}
export interface IMovieScore {

}

export interface ICategory {
    id: number;
    name: string;
    icon: string;
    parent_id: number;
}

export interface ITag {
    id: number;
    name: string;
}

export interface IComment {
    id: number;
    user: IUser;
    content: string;
    agree_count?: number;
    disagree_count?: number;
    reply_count?: number;
    extra_rule?: IExtraRule[];
    created_at: string;
}