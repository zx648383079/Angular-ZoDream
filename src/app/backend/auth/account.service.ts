import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAccountLog, ILoginLog, IBulletinUser, IConnect, IRole } from '../../theme/models/auth';
import { IPage, IData, IDataOne } from '../../theme/models/page';
import { map } from 'rxjs/operators';
import { IUser } from '../../theme/models/user';

@Injectable()
export class AccountService {

  constructor(
      private http: HttpClient
  ) { }

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

  public userList(params: any) {
    return this.http.get<IPage<IUser>>('auth/admin/user', {
      params,
    });
  }

  public user(id: any) {
    return this.http.get<IUser>('auth/admin/user/detail', {
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

  public uploadAvatar(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<IUser>('auth/user/avatar', form);
  }

  public uploadProfile(data: any) {
    return this.http.post<IUser>('auth/user/update', data);
  }
}
