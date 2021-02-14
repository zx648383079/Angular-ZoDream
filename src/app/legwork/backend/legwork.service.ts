import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { ICategory } from '../model';

@Injectable({
  providedIn: 'root'
})
export class LegworkService {

    constructor(private http: HttpClient) { }

    public categoryList(params: any) {
        return this.http.get<IPage<ICategory>>('legwork/admin/category', {params});
    }

    public category(id: any) {
        return this.http.get<ICategory>('legwork/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('legwork/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('legwork/admin/category/delete', {params: {id}});
    }

}
