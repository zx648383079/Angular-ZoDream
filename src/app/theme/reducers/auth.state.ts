import { Map, Record } from 'immutable';
import { IUser } from '../models/user';

interface IAuthState {
    guest: boolean;
    user: IUser;
    roles: string[];
}

export interface AuthState extends Map<string, any>, IAuthState {
}

export const AuthStateRecord = Record({
    guest: true,
    user: Map({}),
    roles: [],
});
