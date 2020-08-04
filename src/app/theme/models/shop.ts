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


