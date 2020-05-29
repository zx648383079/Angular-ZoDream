import { IUser } from '../models/user';
import { mockAvatar } from './page';

export const mockUser: IUser = {
    id: 1,
    email: '123@121.com',
    name: 'zodream',
    avatar: mockAvatar(),
    token: '',
    birthday: '2000-02-02',
    sex: 1,
};
