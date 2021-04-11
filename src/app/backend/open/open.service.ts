import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAuthorize, IPlatform } from '../../theme/models/open';
import { IData, IDataOne, IPage } from '../../theme/models/page';

@Injectable({
  providedIn: 'root'
})
export class OpenService {

    constructor(
        private http: HttpClient
    ) { }

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

    public platformList(params: any) {
        return this.http.get<IPage<IPlatform>>('open/platform', {
          params,
        });
    }

    public platformAll() {
        return this.http.get<IData<IPlatform>>('open/platform/all');
    }

    public platform(id: any) {
        return this.http.get<IPlatform>('open/platform/detail', {
          params: {id},
        });
    }

    public platformSave(data: any) {
        return this.http.post<IPlatform>('open/platform/save', data);
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
    public reviewSave(data: any) {
        return this.http.post<IPlatform>('open/admin/platform/save', data);
    }

    public reviewRemove(id: any) {
        return this.http.delete<IDataOne<true>>('open/admin/platform/delete', {
            params: {id}
        });
    }
}
