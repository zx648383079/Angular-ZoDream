import { IPageEditItem } from '../../theme/models/page';

export interface IChannel {
    id?:         number;
    short_name: string;
    name:       string;
    site_url?:   string;
    updated_at?: string|number;
    created_at?: string|number;

    product_count?: number;
}

export interface IProduct {
    id?:          number;
    parent_id?:   number;
    name:        string;
    en_name:     string;
    cat_id?:      number;
    project_id:  number;
    unique_code: string;
    is_sku?:      0|1;
    updated_at?: string|number;
    created_at?: string|number;

    items?: IProduct[];
    channel_items?: IChannel[];
}

export interface ITradeLog extends IPageEditItem {
    id:         number;
    product_id: number;
    channel_id: number;
    type:       number;
    price:      number;
    order_count?: number;
    created_at: string|number;
    date?: string;
    channel?: IChannel;
    product?: IProduct;
}

export interface ILastestLog extends ITradeLog {
    open?: boolean;
    price_loaded?: boolean;
    price_items?: ITradeLog[];
}

