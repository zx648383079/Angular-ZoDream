import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
import { AuthState, AuthStateRecord } from './auth.state';

export const initialState: any = new AuthStateRecord();

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
