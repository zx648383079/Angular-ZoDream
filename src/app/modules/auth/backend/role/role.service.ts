import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne, IPage } from '../../../../theme/models/page';
import { IRole, IPermission } from '../../../../theme/models/auth';

@Injectable()
export class RoleService {

  constructor(
    private http: HttpClient
  ) { }

  public roleList(params: any) {
    return this.http.get<IPage<IRole>>('auth/admin/role', {
      params,
    });
  }

  public role(id: any) {
    return this.http.get<IRole>('auth/admin/role/detail', {
      params: {id},
    });
  }

  public roleSave(data: any) {
    return this.http.post<IRole>('auth/admin/role/save', data);
  }

  public roleRemove(id: any) {
    return this.http.delete<IDataOne<true>>('auth/admin/role/delete', {
      params: {id}
    });
  }

  public permissionList(params: any) {
    return this.http.get<IPage<IPermission>>('auth/admin/permission', {
      params,
    });
  }

  public permissionAll() {
    return this.http.get<IData<IPermission>>('auth/admin/permission/all');
  }

  public permission(id: any) {
    return this.http.get<IPermission>('auth/admin/permission/detail', {
      params: {id},
    });
  }

  public permissionSave(data: any) {
    return this.http.post<IPermission>('auth/admin/permission/save', data);
  }

  public permissionRemove(id: any) {
    return this.http.delete<IDataOne<true>>('auth/admin/permission/delete', {
      params: {id}
    });
  }

}
