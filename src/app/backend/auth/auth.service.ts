import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAccountLog, IActionLog, IAdminLog, IApplyLog, IRole } from '../../theme/models/auth';
import { IPage, IData, IDataOne } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient
    ) { }


    public userList(params: any) {
        return this.http.get<IPage<IUser>>('auth/admin/user', {
            params,
        });
    }

    public userDetail(id: any) {
        return this.http.get<IUser>('auth/admin/user/detail', {
            params: {id},
        });
    }

    public user(id: any) {
        return this.http.get<IUser>('auth/admin/user/profile', {
            params: {id},
        });
    }

    public userSave(data: any) {
        return this.http.post<IUser>('auth/admin/user/save', data);
    }

    public userRemove(id: any) {
        return this.http.delete<IDataOne<true>>('auth/admin/user/delete', {
            params: {id}
        });
    }

    public roleAll() {
        return this.http.get<IData<IRole>>('auth/admin/role/all');
    }

    public accountLogList(params: any) {
        return this.http.get<IPage<IAccountLog>>('auth/admin/account', {
            params,
        });
    }

    public userAccount(id: any) {
        return this.http.get<IUser>('auth/admin/account/user', {
            params: {id},
        });
    }

    public rechargeSave(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/admin/account/recharge', data);
    }

    public adminLogList(params: any) {
        return this.http.get<IPage<IAdminLog>>('auth/admin/log', {
            params,
        });
    }

    public applyLogList(params: any) {
        return this.http.get<IPage<IApplyLog>>('auth/admin/account/apply', {
        params,
        });
    }

    public actionLogList(params: any) {
        return this.http.get<IPage<IActionLog>>('auth/admin/log/action', {
            params,
        });
    }

    public applySave(data: any) {
        return this.http.post<IApplyLog>('auth/admin/account/apply_save', data);
    }

    public inviteCodeList(params: any) {
        return this.http.get<IPage<any>>('auth/admin/invite', {
            params,
        });
    }
    public inviteLogList(params: any) {
        return this.http.get<IPage<any>>('auth/admin/invite/log', {
            params,
        });
    }

    public inviteCodeCreate(data: any) {
        return this.http.post<any>('auth/admin/invite/save', data);
    }

    public inviteCodeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('auth/admin/invite/delete', {
            params: {id}
        });
    }

    public inviteCodeClear() {
        return this.http.delete<IDataOne<true>>('auth/admin/invite/clear');
    }

    public statistics() {
        return this.http.get<any>('auth/admin/statistics');
    }
}
