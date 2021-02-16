import { IUser } from '../theme/models/user';

export interface ICategory {
    id: number;
    name: string;
    icon: string;
    description: string;
}

export interface IOrder {
    id: number;
    user: IUser;
    provider: IUser;
    waiter: IUser;
    service: IService;
    amount: number;
    remark: any;
    order_amount: number;
    status: number;
    service_score: number;
    waiter_score: number;
    pay_at: string;
    taking_at: string;
    taken_at: string;
    finish_at: string;
    created_at: string;
    updated_a: string;
    status_label?: string;
}

export interface IProvider {
    id: number;
    name: string;
    user: IUser;
    logo: string;
    tel: string;
    address: string;
    longitude: number;
    latitude: number;
    overall_rating: number;
    status: number;
    created_at: string;
    updated_a: string;
    categories?: ICategory[];
}

export interface IWaiter {
    id: number;
    name: string;
    user: IUser;
    tel: string;
    address: string;
    longitude: number;
    latitude: number;
    overall_rating: number;
    status: number;
    created_at: string;
    updated_a: string;
}

export interface IService {
    id: number;
    user: IUser;
    category: ICategory;
    cat_id: number;
    name: string;
    thumb: string;
    brief: string;
    price: number;
    content: string;
    form: any;
    status: number;
    created_at: string;
    updated_a: string;
}

export interface IUserRole {
    is_provider: number;
    is_waiter: number;
}


