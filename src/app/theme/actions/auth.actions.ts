import { IUser } from '../models/user';
// 定义设置 store 的方法
export class AuthActions {
    static LOGIN = 'LOGIN';
    static CHECKING = 'CHECKING';
    static LOGOUT = 'LOGOUT';
    static SET_ROLE = 'SET_ROLE';

    login(user: IUser) {
        return { type: AuthActions.LOGIN, payload: user };
    }

    checking(loading = true) {
        return { type: AuthActions.CHECKING, payload: loading };
    }

    logout() {
        return { type: AuthActions.LOGOUT };
    }

    setRole(roles: string[]) {
        return { type: AuthActions.SET_ROLE, payload: roles};
    }
}
