import { IUser } from '../models/user';
// 定义设置 store 的方法
export class AuthActions {
    static LOGIN = 'LOGIN';
    static CHECKING = 'CHECKING';
    static LOGOUT = 'LOGOUT';
    static SET_ROLE = 'SET_ROLE';
    static USER_UPDATE = 'UPDATE';

    public login(user: IUser) {
        return { type: AuthActions.LOGIN, payload: user };
    }

    /* 容易造成死循环*/
    public update(user: IUser) {
        return { type: AuthActions.USER_UPDATE, payload: user };
    }

    public checking(loading = true) {
        return { type: AuthActions.CHECKING, payload: loading };
    }

    public logout() {
        return { type: AuthActions.LOGOUT };
    }

    public setRole(roles: string[]) {
        return { type: AuthActions.SET_ROLE, payload: roles};
    }
}
