import { AuthFeatureKey, AuthState } from './auth.reducer';
import { IUser } from '../models/user';
import { createFeatureSelector, createSelector } from '@ngrx/store';


interface IAuthStatus {
    isLoading: boolean;
    guest: boolean;
}


export const selectAuth = createFeatureSelector<AuthState>(AuthFeatureKey);

export const selectAuthStatus = createSelector<object, AuthState, IAuthStatus>(
    selectAuth,
    (state: AuthState) => {
        return {
            isLoading: state.isLoading,
            guest: state.guest
        }
    }
);

export const selectAuthUser = createSelector<object, AuthState, IUser>(
    selectAuth,
    (state: AuthState) => state.user
);

export const selectAuthRole = createSelector<object, AuthState, string[]>(
    selectAuth,
    (state: AuthState) => state.roles
);
