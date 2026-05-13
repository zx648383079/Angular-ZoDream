import { createReducer, on } from '@ngrx/store';
import { checkingUser, loginUser, logoutUser, setRoleUser, updateUser } from '../actions/auth.actions';
import { IUser } from '../models/user';

export interface AuthState {
    guest: boolean;
    isLoading: boolean;
    user: IUser|null;
    token: string|null;
    roles: string[];
}

export const initialState: AuthState = {
    guest: true,
    isLoading: false,
    user: null,
    token: null,
    roles: [],
};

export const AuthFeatureKey = 'auth';


export const reducer = createReducer(
    initialState,
    on(loginUser, (state, {user}) => ({
        ...state,
        guest: false,
        isLoading: false,
        user,
        token: user.token ?? null,
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
