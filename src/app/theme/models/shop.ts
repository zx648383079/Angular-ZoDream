import { IUser } from './user';

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
    children?: ICategory[];
}

export interface IProduct {
    id?: number;
    goods_id?: number;
    price?: number;
    market_price?: number;
    stock?: number;
    weight?: number;
    series_number?: string;
    attributes?: string;
}

export interface IGoodsAttribute {
    attr_list: IAttribute[];
    product_list: IProduct[];
}

export interface IHomeProduct {
    hot_products?: IGoods[];
    new_products?: IGoods[];
    best_products?: IGoods[];
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
    gallery?: IGoodsGallery[];
    properties?: any[];
}

export interface IGoodsGallery {
    thumb: string;
    image: string;
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
    shipping_fee: number;
    order_amount: number;
    user?: IUser;
    goods?: IOrderGoods[];
    address?: IAddress;
    checked?: boolean;
    created_at?: string;
    finish_at?: string;
    receive_at?: string;
    shipping_at?: string;
    pay_at?: string;
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
    series_number?: string;
    status?: number;
    thumb?: string;
    type_remark: string;
    amount: number;
    price: number;
    goods_id: number;
    goods: IGoods;
    status_label?: string;
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
    groups?: IShippingGroup[];
}

export interface IShippingGroup {
    regions: IRegion[];
    region_label?: string;
    id?: number;
    shipping_id?: number;
    first_step: number;
    first_fee: number;
    additional: number;
    additional_fee: number;
    free_step: number;
    is_all: boolean;
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
    content: string;
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
    children?: IArticle[];
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
    default_value: string|string[];
    position: number;
    group?: IAttributeGroup;
    attr_items?: IGoodsAttr[];
    new_value?: string;
    new_price?: number;
}

export interface IGoodsAttr {
    id?: number;
    goods_id?: number;
    attribute_id?: number;
    value: string;
    price?: number;
    checked?: boolean;
}


export interface IStore {
    id: number;
    name: string;
    logo: string;
    collect_count?: number;
    is_collected?: boolean;
}

export interface ICartItem {
    id?: number;
    amount: number;
    price?: number;
    is_checked?: boolean;
    goods_id: number;
    product_id?: number;
    goods?: IGoods;
}

export interface ICartGroup {
    shop?: IStore;
    name: string;
    checked?: boolean;
    goods_list: ICartItem[];
}

export interface IButton {
    action: string;
    text: string;
    reason?: any;
}

export interface ILink {
    text: string;
    url: string;
}

export interface ICartCell {
    popup_tip: string;
    link?: ILink;
}

export interface ICartSubtotal {
    total: number;
    total_weight: number;
    original_total: number;
    discount_amount: number;
    count: number;
}

export interface ICartDialog {
    dialog: boolean; // 需要弹窗选择属性
    data: IProduct;
}

export interface ICart {
    dialog?: boolean; // 需要弹窗选择属性
    checkout_button?: IButton;
    data: ICartGroup[];
    promotion_cell?: ICartCell[];
    subtotal: ICartSubtotal;
}


