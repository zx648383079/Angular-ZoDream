import { IPageBaeItem } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

export interface ICateringStore extends IPageBaeItem {
    name: string;
    logo: string;
    keywords: string;
    description: string;
    status: number;
    open_status: number;
    user_id: number;
    address?: string;
    is_open_live?: number;
    is_open_ship?: number;
    is_ship_self?: number;
    is_open_reserve?: number;
    reserve_time?: number;
    user?: IUser;
}

export interface ICateringCategory {
    id: number;
    name: string;
    keywords: string;
    description: string;
}

export interface ICateringProduct {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
}

export interface ICateringAddress {
    id: number;
    name: string;
}

export interface ICateringOrder {
    id: number;
}

export interface ICateringOrderGoods {
    id: number;
    name: string;
    amount: number;
    price: number;
}

export interface ICateringPatron {
    id: number;
    name: string;
    remark: string;
    group_id: number;
    user?: IUser;
}

export interface ICateringPatronGroup {
    id: number;
    name: string;
    discount: number;
}

export interface ICateringStaff {
    user?: IUser;
    role?: ICateringStaffRole;
}

export interface ICateringStaffRole {
    id: number;
    name: string;
    description: string;
    action: string;
}

export interface ICateringStock {
    
}

export interface ICateringRecipeMaterial {
    id: number;
    name: string;
    amount: number;
    unit: number|string;
}


export interface ICateringRecipe {
    id: number;
    name: string;
    image: string;
    description: string;
    remark: string;
}

export interface ICateringPurchaseOrder {
    name: string;
}

export interface ICateringPurchaseOrderGoods {
    name: string;
    amount: number;
    unit: number|string;
    price: number;
}