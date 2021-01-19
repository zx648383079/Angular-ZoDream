import { IUser } from "./user";

export interface IFriendGroup {
    name: string;
    children: IFriend[];
    users?: IFriend[];
    online: number;
    count: number;
    expand?: boolean;
}

export interface IFriend {
    id: number;
    name: string;
    remark: string;
    user: IUser;
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
    user?: IFriend;
}
