import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IComment, ITag } from '../model';

@Injectable({
    providedIn: 'root'
})
export class TVService {

    constructor(
        private http: HttpClient
    ) { }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('tv/admin/category/all');
    }

    public category(id: any) {
        return this.http.get<ICategory>('tv/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('tv/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/category/delete', {params: {id}});
    }

    public tagList(params: any) {
        return this.http.get<IPage<ITag>>('tv/admin/tag', {params});
    }

    public tagRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/tag/delete', {params: {id}});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('tv/admin/comment', {params});
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/comment/delete', {params: {id}});
    }

    public statistics() {
        return this.http.get<any>('tv/admin/statistics');
    }
}
