import { createReducer, on } from '@ngrx/store';
import { checkingUser, loginUser, logoutUser, setRoleUser, updateUser } from '../actions/auth.actions';
import { Map, Record } from 'immutable';
import { IUser } from '../models/user';

interface IAuthState {
    guest: boolean;
    isLoading: boolean;
    user: IUser;
    token: string;
    roles: string[];
}

export interface AuthState extends Map<string, any>, IAuthState {
}

export const AuthStateRecord = Record({
    guest: true,
    isLoading: false,
    user: null,
    token: null,
    roles: [],
});


export const initialState: any = new AuthStateRecord();

export const AuthFeatureKey = 'auth';


export const reducer = createReducer(
    initialState,
    on(loginUser, (state, {user}) => ({
        ...state,
        guest: false,
        isLoading: false,
        user,
        token: user.token,
        roles: [],
    })),
    on(checkingUser, (state, {loading}) => ({
        ...state,
        isLoading: typeof loading === 'boolean' ? loading : true,
    })),
    on(logoutUser, (state) => ({
        ...state,
        guest: true,
        isLoading: false,
        user: null,
        token: null,
        roles: [],
    })),
    on(setRoleUser, (state, {roles}) => ({
        ...state,
        roles
    })),
    on(updateUser, (state, {user}) => ({
        ...state,
        user
    })),
);
