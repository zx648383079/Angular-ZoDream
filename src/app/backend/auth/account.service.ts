import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAccountLog, ILoginLog, IBulletinUser, IConnect } from '../../theme/models/auth';
import { IPage, IData } from '../../theme/models/page';
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

  
}
