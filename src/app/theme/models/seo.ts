export interface ILink {
    name: string;
    url: string;
    description?: string;
}

export interface IItem {
    name: string;
    value: string;
}

export interface IFriendLink {
    id: number;
    name: string;
    url: string;
    logo: string;
    brief: string;
    email: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface IFeedback {
    id: number;
    name: string;
    email: string;
    phone: string;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface ISubscribe {
    id: number;
    email: string;
    status: number;
    created_at: string;
    updated_at: string;
}
