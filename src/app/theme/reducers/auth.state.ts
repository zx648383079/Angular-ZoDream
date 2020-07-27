import { Map, Record, List } from 'immutable';
import { IUser } from '../models/user';

interface IAuthState {
  isAuthenticated: boolean;
  currentUser: IUser;
}

export interface AuthState extends Map<string, any>, IAuthState {
}

export const AuthStateRecord = Record({
  isAuthenticated: false,
  currentUser: Map({}),
});
