import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserRole } from '../theme/models/auth';

@Injectable()
export class BackendService {

    constructor(
        private http: HttpClient
    ) {}

    public roles() {
        return this.http.get<IUserRole>('auth/user/role');
    }

}
