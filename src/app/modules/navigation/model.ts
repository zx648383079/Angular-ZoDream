import { IUser } from '../../theme/models/user';

export interface ISiteCategory {
    id: number;
    name: string;
    icon: string;
    parent_id: number;
    children?: ISiteCategory[];
    lazy_booted?: boolean;
}

export interface ISite {
    id: number;
    name: string;
    logo: string;
    schema: string;
    domain: string;
    cat_id: number;
    description: string;
    top_type: number;
    score: number;
    user?: IUser;
    category?: ISiteCategory;
    tags?: ISiteTag[];
}

export interface ISiteScoringLog {
    id: number;
    change_reason: string;
    last_score: number;
    score: number;
    user?: IUser;
    site?: ISite;
}

export interface ISiteTag {
    id: number;
    name: string;
}

export interface IWebPage {
    id: number;
    title: string;
    description: string;
    thumb: string;
    link: string;
    site_id: number;
    score: number;
    site?: ISite;
    keywords?: IWebPageKeywords[];
    updated_at?: string;
}

export interface IWebPageKeywords {
    id: number;
    word: string;
    type: number;
}

export interface ISiteCollect {
    id: number;
    name: string;
    link: string;
    group_id: number;
}

export interface ISiteCollectGroup {
    id: number;
    name: string;
    items?: ISiteCollect[];
}