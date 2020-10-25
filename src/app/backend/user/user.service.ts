import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IAccountLog, IBulletinUser, IConnect, ILoginLog } from '../../theme/models/auth';
import { IData, IPage } from '../../theme/models/page';
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

    public connect() {
      return this.http.get<IData<IConnect>>('auth/account/connect').pipe(map(res => res.data));
    }

    public uploadAvatar(file: File) {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<IUser>('auth/user/avatar', form);
    }

    public uploadProfile(data: any) {
        return this.http.post<IUser>('auth/user/update', data);
    }
}
