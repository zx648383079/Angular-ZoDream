import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IUserRole } from '../theme/models/auth';

@Injectable()
export class BackendService {
    private readonly http = inject(HttpClient);


    public roles() {
        return this.http.get<IUserRole>('auth/user/role');
    }

    public statistics() {
        return this.http.get<any>('seo/admin/statistics');
    }

}
