import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAccountLog, IActionLog, IAdminLog, IApplyLog, IBanAccount, IEquityCard, IInviteCode, IInviteLog, ILoginLog, IRole, IUserCard } from '../../../theme/models/auth';
import { IPage, IData, IDataOne } from '../../../theme/models/page';
import { IUser, IUserStatus, IUserZone } from '../../../theme/models/user';

@Injectable()
export class AuthService {
    private readonly http = inject(HttpClient);



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

    public userVerify(data: any) {
        return this.http.post<IUser>('auth/admin/user/verify', data);
    }

    public userRemove(id: any) {
        return this.http.delete<IDataOne<true>>('auth/admin/user/delete', {
            params: {id}
        });
    }

    public roleAll() {
        return this.http.get<IData<IRole>>('auth/admin/role/all');
    }

    public banList(params: any) {
        return this.http.get<IPage<IBanAccount>>('auth/admin/ban', {
            params,
        });
    }

    public ban(user: number) {
        return this.http.post<IDataOne<boolean>>('auth/admin/ban/add', {user});
    }

    public banRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/admin/ban/delete', {params: {id}});
    }

    public banRemoveUser(user: number) {
        return this.http.post<IDataOne<boolean>>('auth/admin/ban/delete_user', {user});
    }

    public accountLogList(params: any) {
        return this.http.get<IPage<IAccountLog>>('auth/admin/account', {
            params,
        });
    }

    public loginLogList(params: any) {
        return this.http.get<IPage<ILoginLog>>('auth/admin/log/login', {
            params,
        });
    }

    public userAccount(params: any) {
        return this.http.get<IUserStatus>('auth/admin/account/user', {
            params,
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
        return this.http.get<IPage<IInviteCode>>('auth/admin/invite', {
            params,
        });
    }
    public inviteLogList(params: any) {
        return this.http.get<IPage<IInviteLog>>('auth/admin/invite/log', {
            params,
        });
    }

    public inviteCodeCreate(data: any) {
        return this.http.post<IInviteCode>('auth/admin/invite/save', data);
    }

    public inviteCodeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('auth/admin/invite/delete', {
            params: {id}
        });
    }

    public inviteCodeClear() {
        return this.http.delete<IDataOne<true>>('auth/admin/invite/clear');
    }

    public userCardList(params: any) {
        return this.http.get<IPage<IUserCard>>('auth/admin/card/user', {
            params,
        });
    }

    public cardList(params: any) {
        return this.http.get<IPage<IEquityCard>>('auth/admin/card', {
            params,
        });
    }

    public cardSearch(params: any) {
        return this.http.get<IPage<IEquityCard>>('auth/admin/card/search', {
            params,
        });
    }

    public cardSave(data: any) {
        return this.http.post<IEquityCard>('auth/admin/card/save', data);
    }

    public userCardUpdate(data: any) {
        return this.http.post<IUserCard>('auth/admin/card/user_update', data);
    }

    public cardRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/admin/card/delete', {params: {id}});
    }

    public zoneList(params: any) {
        return this.http.get<IPage<IUserZone>>('auth/admin/zone', {
            params,
        });
    }

    public zoneSave(data: any) {
        return this.http.post<IUserZone>('auth/admin/zone/save', data);
    }

    public zoneRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/admin/zone/delete', {params: {id}});
    }

    public batch(data: {
        roles?: any;
        zones?: any;
    }) {
        return this.http.post<{
            roles: IRole[];
            zones: IUserZone[];
        }>('auth/admin/batch', data);
    }

    public statistics() {
        return this.http.get<any>('auth/admin/statistics');
    }
}
