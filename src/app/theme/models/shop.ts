export interface IBrand {
    id: number;
    name: string;
    keywords?: string;
    description?: string;
    url: string;
}
export interface ICategory {
    id: number;
    name: string;
    icon: string;
    banner: string;
    app_banner: string;
    parent_id?: number;
    expanded?: boolean;
    level?: number;
}

export interface IProduct {
    id: number;
    name: string;
    thumb: string;
    price: string;
    market_price: string;
    shop: string;
    category?: ICategory;
    brand?: IBrand;
    stock?: number;
    is_new?: boolean;
    is_best?: boolean;
    is_hot?: boolean;
}
