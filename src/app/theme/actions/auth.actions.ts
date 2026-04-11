import { createAction, props } from '@ngrx/store';
import { IUser } from '../models/user';
// 定义设置 store 的方法
export const loginUser = createAction('[auth]LOGIN', props<{user: IUser}>());
export const updateUser = createAction('[auth]UPDATE', props<{user: IUser}>());
export const checkingUser = createAction('[auth]CHECKING', props<{loading: boolean}>());
export const logoutUser = createAction('[auth]LOGOUT');
export const setRoleUser = createAction('[auth]SET_ROLE', props<{roles: string[]}>());

