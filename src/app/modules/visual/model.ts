import { IItem } from '../../theme/models/seo';
import { IUser } from '../../theme/models/user';

export const ComponentTypeItems: IItem[] = [
    {name: '页面', value: 0},
    {name: '组件', value: 1},
];

export interface ICategory {
    id: number;
    name: string;
    parent_id: number;
    children?: ICategory[];
    thumb?: string;
    description?: string;
    active?: boolean;
    level?: number;
    count?: number;
}

export interface IThemeComponent {
    id: number;
    name: string;
    type: number;
    cat_id: number;
    thumb: string;
    keywords: string;
    description: string;
    price: number;
    path: string;
    status: number;
    updated_at?: string;
    created_at?: string;
    category?: ICategory;
    user?: IUser;
    use_count?: number;
}

export interface ISite {
    id: number;
    name: string;
    title: string;
    thumb: string;
    logo: string;
    domain: string;
    keywords: string;
    description: string;
    status: number;
    is_share: boolean;
    share_price: number;
    updated_at?: string;
    created_at?: string;
    user?: IUser;
}

export interface ISitePage {
    id: number;
    name: string;
    title: string;
    thumb: string;
    keywords: string;
    description: string;
    status: number;
    site_id: number;
    updated_at?: string;
    created_at?: string;
    site?: ISite;
}

export interface ISiteComponent extends IThemeComponent {
    component_id: number;
    site_id: number;
}