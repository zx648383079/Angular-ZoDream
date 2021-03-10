import { IUser } from '../theme/models/user';

export interface ICategory {
    id: number;
    name: string;
}

export interface ICategoryUser {
    user: IUser;
    category: ICategory;
    user_id: number;
    cat_id: number;
}

export interface IWord {
    id: number;
    content: string;
    cat_id?: number;
    category?: ICategory;
}

export interface IMessage {
    id: number;
    user: IUser;
    send_type: number;
    type: number;
    content: string;
    created_at: string;
}
