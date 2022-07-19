import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { IShortLink } from '../model';

@Injectable({
    providedIn: 'root'
})
export class ShortLinkService {

    constructor(
        private http: HttpClient
    ) { }


    public linkList(params: any) {
        return this.http.get<IPage<IShortLink>>('short/admin', {params});
    }

    public link(id: any) {
        return this.http.get<IShortLink>('short/admin/home/detail', {params: {id}});
    }

    public linkSave(data: any) {
        return this.http.post<IShortLink>('short/admin/home/save', data);
    }

    public linkRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('short/admin/home/delete', {params: {id}});
    }

    public statistics() {
        return this.http.get<any>('short/admin/statistics');
    }
}
