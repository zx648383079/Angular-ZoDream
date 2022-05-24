import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IComment, IResource, ITag } from '../model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    constructor(
        private http: HttpClient
    ) { }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('res/admin/category/all');
    }

    public category(id: any) {
        return this.http.get<ICategory>('res/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('res/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('res/admin/category/delete', {params: {id}});
    }

    public resourceList(params: any) {
        return this.http.get<IPage<IResource>>('res/admin/resource', {params});
    }

    public resource(id: any) {
        return this.http.get<IResource>('res/admin/resource/detail', {params: {id}});
    }

    public resourceSave(data: any) {
        return this.http.post<IResource>('res/admin/resource/save', data);
    }

    public resourceRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('res/admin/resource/delete', {params: {id}});
    }

    public tagList(params: any) {
        return this.http.get<IPage<ITag>>('res/admin/tag', {params});
    }

    public tagRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('res/admin/tag/delete', {params: {id}});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('res/admin/comment', {params});
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('res/admin/comment/delete', {params: {id}});
    }

    public statistics() {
        return this.http.get<any>('res/admin/statistics');
    }
}
