import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IUser, IUserZone } from '../../theme/models/user';
import { IStatisticsItem } from '../../theme/models/seo';
import { IBulletinUser } from '../../theme/models/auth';

@Injectable()
export class UserService {
    private http = inject(HttpClient);


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

    public bulletinUser(extra?: any) {
        return this.http.get<IData<IUser>>('auth/bulletin/user', {params: {extra}});
    }

    public bulletinRead(id: number) {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/read', {id});
    }

    public bulletinReadAll() {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/read_all', {});
    }

    public bulletinSend(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/bulletin/send', data);
    }

    public bulletinRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('auth/bulletin/delete', {params: {id}});
    }

    public zoneList() {
        return this.http.get<{
            selected: IUserZone[];
            data: IUserZone[];
            activated_at: number;
        }>('auth/zone');
    }

    public zoneSave(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/zone/save', data);
    }
}
