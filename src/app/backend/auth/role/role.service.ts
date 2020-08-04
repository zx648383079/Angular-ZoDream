import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../../../theme/models/page';
import { IRole, IPermission } from '../../../theme/models/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient
  ) { }

  public roleList(params: any) {
    return this.http.get<IPage<IRole>>('auth/admin/role', {
      params,
    });
  }

  public permissionList(params: any) {
    return this.http.get<IPage<IPermission>>('auth/admin/permission', {
      params,
    });
  }

}
