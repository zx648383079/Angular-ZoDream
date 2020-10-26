import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INav } from '../theme/components';
import { IUserRole } from '../theme/models/auth';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient
  ) { }

  public roles() {
    return this.http.get<IUserRole>('auth/user/role');
  }

  public filterNavByRole(items: INav[], roles: string[], parentRole?: string): INav[] {
    const data: INav[] = [];
    items.forEach(item => {
      if (item.children) {
        item.children = this.filterNavByRole(item.children, roles, item.role);
      }
      const current = item.role || parentRole;
      if (!current || roles.indexOf(current) >= 0) {
        data.push(item);
        return;
      }
      if (item.children && item.children.length > 0) {
        item.url = undefined;
        data.push(item);
      }
    });
    return data;
  }

}
