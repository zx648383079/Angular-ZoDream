import { IExtraRule } from '../theme/components/rule-block/model';
import { IUser } from "../theme/models/user";

export interface IFriendGroup {
    id?: number;
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
    id:         number;
    type:       number;
    content:    string;
    item_id:    number;
    receive_id: number;
    group_id:   number;
    user_id:    number;
    status:     number;
    deleted_at: number;
    updated_at: string;
    created_at: string;
    extra_rule: IExtraRule[];
    user:       IFriend;
    receive:    IFriend;
}

export interface IChatHistory {
    id:           number;
    item_type:    number;
    item_id:      number;
    user_id:      number;
    unread_count: number;
    last_message: number;
    updated_at:   string;
    created_at:   string;
    message:      IMessage;
    user:         IUser;
    friend:       IFriend;
    group?:       IGroup;
}

export interface IGroup {
    id?: number;
    name: string;
    logo: string;
    users?: IGroupUser[];
}

export interface IGroupUser {
    id?: number;
    name: string;
    role_id: number;
    user: IUser;
}
