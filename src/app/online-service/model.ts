import { IUser } from '../theme/models/user';

export interface ICategory {
    id: number;
    name: string;
    words?: IWord[];
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

export interface ISession {
    id: number;
    name: string;
    remark: string;
    user?: IUser;
    user_id: number;
    content?: string;
    count?: number;
    status: number;
    ip: string;
    user_agent: string;
    created_at: string;
    service_word: number;
}

export interface IMessage {
    id: number;
    user_id: number;
    user: IUser;
    send_type: number;
    type: number;
    content: string;
    created_at: string;
}
