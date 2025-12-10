import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { IAuthorize, IPlatform } from '../../theme/models/open';
import { IData, IDataOne, IPage } from '../../theme/models/page';

@Injectable()
export class OpenService {
    private http = inject(HttpClient);


    public authorizeList(params: any) {
        return this.http.get<IPage<IAuthorize>>('open/authorize', {
            params
        });
    }

    public authorizeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('open/authorize/delete', {
          params: {id}
        });
    }

    public authorizeClear() {
        return this.http.delete<IDataOne<true>>('open/authorize/clear');
    }

    public authorizeCreate(data: any) {
        return this.http.post<any>('open/authorize/save', data);
    }

    public platformList(params: any) {
        return this.http.get<IPage<IPlatform>>('open/platform', {
          params,
        });
    }

    public platformAll() {
        return this.http.get<IData<IPlatform>>('open/platform/all');
    }

    public authorizePlatform() {
        return this.http.get<IData<IPlatform>>('open/authorize/platform');
    }

    public platform(id: any) {
        return this.http.get<IDataOne<IPlatform>>('open/platform/detail', {
          params: {id},
        }).pipe(map(res => res.data));
    }

    public platformSave(data: any) {
        return this.http.post<IDataOne<IPlatform>>('open/platform/save', data).pipe(map(res => res.data));
    }

    public platformRemove(id: any) {
        return this.http.delete<IDataOne<true>>('open/platform/delete', {
            params: {id}
        });
    }

    public reviewList(params: any) {
        return this.http.get<IPage<IPlatform>>('open/admin/platform', {
             params,
        });
    }

    public review(id: any) {
        return this.http.get<IDataOne<IPlatform>>('open/admin/platform/detail', {
          params: {id},
        }).pipe(map(res => res.data));
    }

    public reviewSave(data: any) {
        return this.http.post<IDataOne<IPlatform>>('open/admin/platform/save', data);
    }

    public reviewRemove(id: any) {
        return this.http.delete<IDataOne<true>>('open/admin/platform/delete', {
            params: {id}
        });
    }

    public statistics() {
        return this.http.get<any>('open/admin/statistics');
    }
}
