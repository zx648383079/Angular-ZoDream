import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IAccountLog, IBulletinUser, IConnect, ILoginLog } from '../../theme/models/auth';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient
    ) { }

    public profile() {
        return this.http.get<IUser>('auth/user');
    }

    public accountLog(params: any) {
        return this.http.get<IPage<IAccountLog>>('auth/account/log', {
            params,
        });
    }

    public loginLog(params: any) {
        return this.http.get<IPage<ILoginLog>>('auth/account/login_log', {
            params,
        });
    }

    public bulletinList(params: any) {
        return this.http.get<IPage<IBulletinUser>>('auth/bulletin', {
            params,
        });
    }

    public bulletinRead(id: number) {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/read', {id});
    }

    public bulletinReadAll() {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/read_all', {});
    }

    public bulletinRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/bulletin/delete', {params: {id}});
    }

    public connect() {
        return this.http.get<IData<IConnect>>('auth/account/connect').pipe(map(res => res.data));
    }

    public connectRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/account/connect_delete', {params: {id}});
    }

    public uploadAvatar(file: File) {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<IUser>('auth/user/avatar', form);
    }

    public passwordUpdate(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/password/update', data);
    }

    public settings() {
        return this.http.get<IDataOne<any>>('auth/user/option').pipe(map(res => res.data));
    }

    public settingsSave(data: any) {
        return this.http.post<IDataOne<any>>('auth/user/option_save', data);
    }

    public updateProfile(data: any) {
        return this.http.post<IUser>('auth/user/update', data);
    }

    public updateAccount(data: any) {
        return this.http.post<IUser>('auth/user/update_account', data);
    }

    public sendCode(data: {
        to_type: 'mobile'|'email',
        to?: string;
        event: string;
    }) {
        return this.http.post<IDataOne<boolean>>('auth/password/send_code', data);
    }
    public verifyCode(data: {
        to_type: 'mobile'|'email',
        to?: string;
        code: string;
        event: string;
    }) {
        return this.http.post<IDataOne<boolean>>('auth/password/verify_code', data);
    }

    public create2FA() {
        return this.http.get<{
            recovery_code: string,
            qr: string,
        }>('auth/passkey/twofa');
    }

    public save2FA(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/passkey/twofa_save', data);
    }
}
