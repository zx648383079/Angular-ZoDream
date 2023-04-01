import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
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

export function reducer(state = initialState, { type, payload }: Action & { payload }): AuthState {
    switch (type) {
        case AuthActions.LOGIN:
            return state.merge({
                guest: false,
                isLoading: false,
                user: payload,
                token: payload.token,
                roles: [],
            }) as AuthState;
        case AuthActions.CHECKING:
            return state.merge({
                isLoading: typeof payload === 'boolean' ? payload : true,
            }) as AuthState;
        case AuthActions.LOGOUT:
            return state.merge({
                guest: true,
                isLoading: false,
                user: null,
                token: null,
                roles: [],
            }) as AuthState;
        case AuthActions.SET_ROLE:
            return state.merge({
                roles: payload
            });
        case AuthActions.USER_UPDATE:
            return state.merge({
                user: payload
            });
        default:
            return state;
    }
}
