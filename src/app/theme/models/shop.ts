import { IUser } from './user';

export interface IBrand {
    id: number;
    name: string;
    keywords?: string;
    description?: string;
    logo?: string;
    app_logo?: string;
    url: string;
    image?: string;
    price?: number;
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
    goods_list?: IGoods[];
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
    seo_title?: string;
    seo_description?: string;
    seo_link?: string;
    dynamic_position: string;
    deleted_at: number;
    created_at: string;
    updated_at: string;
    shop: string;
    category?: ICategory;
    brand?: IBrand;
    gallery?: IGoodsGallery[];
    properties?: any[];
    products?: IProduct[];
    coupons?: ICoupon[];
    promotes?: IActivity<any>[];
    is_collect?: boolean;
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


export interface IOrderCount {
    un_pay?: number;
    shipped?: number;
    finish?: number;
    cancel?: number;
    invalid?: number;
    paid_un_ship?: number;
    received?: number;
    uncomment?: number;
    refunding?: number;
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


export interface ICommentSubtotal {
    total: number;
    good: number;
    middle: number;
    bad: number;
    avg: number;
    favorable_rate: number;
    tags: ITag[];
    comments: IComment[];
}

export interface IImage {
    image: string;
}

export interface IComment {
    id?: number;
    title: string;
    content: string;
    rank: number;
    user?: IUser;
    images?: IImage[];
    goods?: IGoods;
    created_at: string;
}

export interface ITag {
    label: string;
    count: number;
}

export interface ICoupon {
    id: number;
    name: string;
    thumb: string;
    type: number;
    rule: number;
    rule_value: string;
    min_money: number;
    money: number;
    send_type: number;
    send_value: number;
    received?: number;
    can_receive?: boolean;
    every_amount: number;
    start_at: number;
    end_at: number;
    created_at: string;
    updated_at: string;
}

export interface IInvoiceTitle {
    id?: number;
    title_type: number;
    type: number;
    title: string;
    tax_no: string;
    tel: string;
    bank: string;
    account: string;
    address: string;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface IWarehouse {
    id: number;
    name: string;
    tel: string;
    link_user: string;
    address: string;
    remark: string;
    created_at?: string;
    updated_at?: string;
    region?: IRegion[];
}

export interface IWarehouseGoods {
    id: number;
    warehouse_id: number;
    goods_id: number;
    product_id: number;
    amount: number;
    warehouse?: IWarehouse;
    goods?: IGoods;
    product?: IProduct;
}

export interface IWarehouseLog {
    id: number;
    warehouse_id: number;
    goods_id: number;
    product_id: number;
    amount: number;
    order_id: number;
    remark: string;
    created_at: string;
    warehouse?: IWarehouse;
    goods?: IGoods;
    user?: IUser;
}

export interface IActivity<T = any> {
    id: number;
    name: string;
    thumb: string;
    description: string;
    type: number;
    scope_type: number;
    scope: string;
    configure: T;
    status: number;
    start_at: number|string;
    end_at: number|string;
    created_at: string;
    updated_at: string;
    goods?: IGoods;
}

export interface IAuctionConfigure {
    mode: number;
    begin_price: number;
    fixed_price: number;
    step_price: number;
    deposit: number;
}

export interface IBargainConfigure {
    min: number;
    max: number;
    times: number;
    amount: number;
    shipping_fee: number;
}

export interface ICashBackConfigure {
    order_amount: number;
    star: number;
    money: number;
}

export interface IDiscountConfigure {
    type: number;
    amount: number;
    check_discount: number;
    check_money: number;
    check_gift: number;
    check_shipping: number;
    discount_value: number;
    discount_money: number;
    discount_goods: number;
}

export interface IFreeTrialConfigure {
    amount: number;
}

export interface IGroupBuyConfigure {
    deposit: number;
    amount: number;
    send_point: number;
    step: IGroupBuyStep[];
}

export interface IGroupBuyStep {
    amount: number;
    price: number;
}

export interface ILotteryConfigure {
    time_price: number;
    buy_times: number;
    start_times: number;
    btn_text: string;
    over_text: string;
    items: ILotteryGift[];
}

export interface ILotteryGift {
    name: string;
    goods?: IGoods;
    goods_id: number;
    chance: number;
    color: string;
}

export interface IMixConfigure {
    price: number;
    goods: IMixGoods[];
}

export interface IMixGoods {
    goods?: IGoods;
    goods_id: number;
    amount: number;
    price: number;
}

export interface IPreSaleConfigure {
    final_start_at: string;
    final_end_at: string;
    ship_at: string;
    price_type: number;
    price: number;
    step: IGroupBuyStep[];
    deposit: number;
    deposit_scale: number;
    deposit_scale_other: number;
}

export interface IActivityTime {
    id: number;
    title: string;
    start_at: number|string;
    end_at: number|string;
}

export interface ISeckillGoods {
    id: number;
    act_id: number;
    time_id: number;
    goods_id: number;
    price: number;
    amount: number;
    every_amount: number;
    goods?: IGoods;
}

export interface ICollect {
    goods_id: number;
    goods?: IGoods;
}

export enum ORDER_STATUS {
    CANCEL = 1,
    INVALID = 2,
    UN_PAY = 10,
    PAID_UN_SHIP = 20,
    SHIPPED = 40,
    RECEIVED = 60,
    FINISH = 80,
}
