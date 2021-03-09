import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { ICategory } from '../model';

@Injectable()
export class OnlineService {

    constructor(
        private http: HttpClient,
    ) { }

    public categoryList(params: any) {
        return this.http.get<IPage<ICategory>>('os/admin/category', {params});
    }

    public category(id: any) {
        return this.http.get<ICategory>('os/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('os/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('os/admin/category/delete', {params: {id}});
    }

}
