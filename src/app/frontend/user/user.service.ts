import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { IStatisticsItem } from '../../theme/models/seo';
import { IBulletinUser } from '../../theme/models/auth';

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient
    ) { }

    public profile() {
        return this.http.get<IUser>('auth/user');
    }

    public statistics() {
        return this.http.get<IData<IStatisticsItem>>('auth/user/statistics');
    }

    public bulletinList(params: any) {
        return this.http.get<IPage<IBulletinUser>>('auth/bulletin', {
            params,
        });
    }

    public bulletinRead(id: number) {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/read', {id});
    }

    public bulletinReadAll() {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/read_all', {});
    }

    public bulletinRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/bulletin/delete', {params: {id}});
    }
}
