import { AppState } from '../interfaces';
import { createSelector } from 'reselect';
import { AuthState } from './auth.reducer';
import { IUser } from '../models/user';

// Base state function
function getAuthState(state: AppState): AuthState {
    return state.auth;
}


function fetchAuthStatus(state: AuthState): boolean {
    return !state.guest;
}

function fetchCurrentUser(state: AuthState): IUser|null {
    return state.user;
}

function fetchUserProfile(state: AuthState): {
    isLoading: boolean;
    user: IUser|null;
} {
    return {
        isLoading: state.isLoading,
        user: state.user
    };
}

function fetchRole(state: AuthState): string[] {
    return state.roles;
}


// *************************** 获取store值 ****************************
export const getAuthStatus = createSelector(getAuthState, fetchAuthStatus);
export const getCurrentUser = createSelector(getAuthState, fetchCurrentUser);
export const getUserProfile = createSelector(getAuthState, fetchUserProfile);
export const getUserRole = createSelector(getAuthState, fetchRole);
