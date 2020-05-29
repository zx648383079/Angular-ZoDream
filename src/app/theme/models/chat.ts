export interface IUserGroup {
    name: string;
    children: IUser[];
    online: number;
    count: number;
    expand?: boolean;
}

export interface IUser {
    id: number;
    name: string;
    remark: string;
    avatar: string;
    signature: string;
    last_at?: number;
    status?: number;
    unread?: number;
    last_message?: IMessage;
}

export interface IMessage {
    content: string;
    type: number;
    created_at: number;
    user_id: number;
    user?: IUser;
}
