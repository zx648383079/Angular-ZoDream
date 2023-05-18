import { IExtraRule } from '../../components/link-rule';
import { IUser } from '../../theme/models/user';


export interface ILive {
    id: number;
    title: string;
    thumb: string;
    source: string;
    status: number;
}

export interface IMusicList {
    id: number;
    title: string;
    cover: string;
    description: string;
    created_at: string;
    items: IMusic[];
}

export interface IMusic {
    id: number;
    name: string;
    cover: string;
    album: string;
    artist: string;
    duration: number;
    files?: IMusicFile[];
}
export interface IMusicFile {
    id: number;
    music_id: number;
    file_type: number;
    file: string;
    url?: string;
}

export interface IMovieArea {
    id: number;
    name: string;
}

export interface IMovie {
    id: number;
    title: string;
    film_title: string;
    translation_title: string;
    cover: string;
    director: string;
    leader: string;
    screenwriter: string;
    cat_id: number;
    area_id: number;
    age: string;
    language: string;
    release_date: string;
    duration: string;
    description: string;
    content: string;
    series_count: number;
    status: number;
    view_count: number;
    comment_count: number;
    updated_at: string;
    created_at: string;
    area?: IMovieArea;
    tags?: ITag[];
    user?: IUser;
    category?: ICategory;
}
export interface IMovieFile {
    id: number;
    name: string;
    movie_id: number;
    series_id: number;
    file_type: number;
    definition: number;
    file: string;
    size: number;
    url?: string;
}

export interface IMovieSeries {
    id: number;
    movie_id: number;
    episode: number;
    title: string;
}
export interface IMovieScore {
    id: number;
    name: string;
    score: number;
    url: string;
}

export interface ICategory {
    id: number;
    name: string;
    icon: string;
    parent_id: number;
    level?: number;
    recommend_items?: IMovie[];
    new_items?: IMovie[];
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