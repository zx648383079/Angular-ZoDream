import { IUser } from '../theme/models/user';

export interface ISiteCategory {
    id: number;
    name: string;
    icon: string;
    parent_id: number;
    children?: ISiteCategory[];
}

export interface ISite {
    id: number;
    name: string;
    logo: string;
    schema: string;
    domain: string;
    cat_id: number;
    description: string;
    user?: IUser;
    category?: ISiteCategory;
    tags?: ISiteTag[];
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
    page_rank: number;
    site?: ISite;
    keywords?: IWebPageKeywords[];
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
}

export interface ISiteCollectGroup {
    id: number;
    name: string;
    items?: ISiteCollect[];
}