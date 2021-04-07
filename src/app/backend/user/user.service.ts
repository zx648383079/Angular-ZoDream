import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IAccountLog, IBulletinUser, IConnect, ILoginLog } from '../../theme/models/auth';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

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

    public uploadAvatar(file: File) {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<IUser>('auth/user/avatar', form);
    }

    public passwordUpdate(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/password/update', data);
    }

    public uploadProfile(data: any) {
        return this.http.post<IUser>('auth/user/update', data);
    }
}
