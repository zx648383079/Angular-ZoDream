import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
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
    user: null,
    roles: [],
});


export const initialState: any = new AuthStateRecord();

export const AuthFeatureKey = 'auth';

export function reducer(state = initialState, { type, payload }: Action & { payload }): AuthState {
    switch (type) {
        case AuthActions.LOGIN:
            return state.merge({
                guest: false,
                user: payload,
                roles: [],
            }) as AuthState;

        case AuthActions.LOGOUT:
            return state.merge({
                guest: true,
                user: null,
                roles: [],
            }) as AuthState;
        case AuthActions.SET_ROLE:
            return state.merge({
                roles: payload
            });
        default:
            return state;
    }
}
