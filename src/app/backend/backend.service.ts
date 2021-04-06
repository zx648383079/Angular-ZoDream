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
  ) {}

  public roles() {
      return this.http.get<IUserRole>('auth/user/role');
  }

  public filterNavByRole(items: INav[], roles: string[], parentRole ? : string): INav[] {
      const data: INav[] = [];
      items.forEach(item => {
          const children = !item.children ? undefined : this.filterNavByRole(item.children, roles, item.role);
          const current = item.role || parentRole;
          if (!current || roles.indexOf(current) >= 0) {
              data.push({...item, children});
              return;
          }
          if (children && children.length > 0) {
              data.push({...item, children, url: undefined});
          }
      });
      return data;
  }

}
