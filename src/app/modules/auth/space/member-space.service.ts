import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IUserStatus } from '../../../theme/models/user';
import { IDataOne } from '../../../theme/models/page';

@Injectable({
    providedIn: 'root'
})
export class MemberSpaceService {
    private readonly http = inject(HttpClient);


    public user(params: any) {
        return this.http.get<IUserStatus>('auth/space', {params});
    }

    public toggleFollow(user: any) {
        return this.http.post<IDataOne<number>>('auth/space/follow', {user});
    }

    public toggleMark(user: any) {
        return this.http.post<IDataOne<number>>('auth/space/mark', {user});
    }

    public report(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/space/report', data);
    }

}
