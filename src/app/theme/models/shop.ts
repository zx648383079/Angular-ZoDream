export interface IBrand {
    id: number;
    name: string;
    keywords?: string;
    description?: string;
    logo?: string;
    app_logo?: string;
    url: string;
}
export interface ICategory {
    id: number;
    name: string;
    icon: string;
    banner: string;
    keywords?: string;
    description?: string;
    app_banner: string;
    parent_id?: number;
    position?: number;
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

export interface IGoods {
    id: number;
    cat_id: number;
    brand_id: number;
    name: string;
    series_number: string;
    keywords: string;
    thumb: string;
    picture: string;
    description: string;
    brief: string;
    content: string;
    price: number;
    market_price: number;
    stock: number;
    attribute_group_id: number;
    weight: number;
    shipping_id: number;
    sales: string;
    is_best: number;
    is_hot: number;
    is_new: number;
    status: number;
    admin_note: string;
    type: number;
    position: number;
    dynamic_position: string;
    deleted_at: number;
    created_at: string;
    updated_at: string;
    shop: string;
    category?: ICategory;
    brand?: IBrand;
}


export interface IOrder {
    id: number;
    series_number: string;
    status_label: string;
    status: number;
    goods_amount: number;
    payment_id: number;
    payment_name: string;
    shipping_id: number;
    shipping_name: string;
    goods?: IOrderGoods[];
    address?: IAddress;
    checked?: boolean;
}

export interface IAddress {
    id: number;
    name: string;
    tel: string;
    region_id: number;
    region?: IRegion;
    region_name?: string;
    address: string;
    is_default?: boolean;
}

export interface IRegion {
    id: number;
    name: string;
    parent_id?: number;
    full_name?: string;
    children?: IRegion[];
}

export interface IOrderGoods {
    id: number;
    name?: string;
    status?: number;
    amount: number;
    price: number;
    goods_id: number;
    goods: IProduct;
}

export interface ILogistics {
    id: number;
    content: string;
    created_at: string;
}

export interface IShipping {
    id: number;
    name: string;
    code: string;
    method: number;
    icon: string;
    description: string;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface IPayment {
    id: number;
    name: string;
    code: string;
    icon: string;
    description: string;
}

export interface IArticle {
    id: number;
    title: string;
    description: string;
    thumb: string;
    cat_id: number;
    created_at: string;
    updated_at: string;
    category: IArticleCategory;
}

export interface IArticleCategory {
    id: number;
    name: string;
    keywords: string;
    description: string;
    parent_id: number;
    position: number;
    level?: number;
}

export interface IAd {
    id: number;
    name: string;
    position_id: number;
    type: number;
    url: string;
    content: string;
    start_at: string;
    end_at: string;
    created_at: string;
    updated_at: string;
    position?: IAdPosition;
}

export interface IAdPosition {
    id: number;
    name: string;
    width: number;
    height: number;
    template: string;
    created_at: string;
    updated_at: string;
}

export interface IAttributeGroup {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface IAttribute {
    id: number;
    name: string;
    group_id: number;
    type: number;
    search_type: number;
    input_type: number;
    default_value: string;
    position: number;
    group?: IAttributeGroup;
}


