import { IUser, IMessage, IUserGroup } from '../models/chat';
import { mockAvatar, mockTimestamp } from './page';

export const mockFriends: IUser[] = [
    {
        id: 1,
        name: 'jh',
        remark: '备注',
        avatar: mockAvatar(),
        signature: '个性签名',
    },
    {
        id: 2,
        name: '特斯',
        remark: '',
        avatar: mockAvatar(),
        signature: '个性签名',
    }
];

export const mockMessages: IMessage[] = [
    {
        content: '111',
        type: 0,
        user_id: 1,
        created_at: mockTimestamp()
    },
    {
        content: '3333',
        type: 0,
        user_id: 2,
        created_at: mockTimestamp()
    }
];

export const mockGroups: IUserGroup[] = [
    {
        name: '我的好友',
        online: 0,
        count: 2,
        children: mockFriends
    }
];
