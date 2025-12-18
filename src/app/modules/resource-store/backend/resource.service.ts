import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IUploadResult } from '../../../theme/models/open';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IComment, IResource, ITag } from '../model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private readonly http = inject(HttpClient);


    public categoryTree() {
        return this.http.get<IData<ICategory>>('res/admin/category/all');
    }

    public categoryList() {
        return this.http.get<IData<ICategory>>('res/admin/category');
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
        return this.http.get<IPage<IResource>>('res/admin/home', {params});
    }

    public resource(id: any) {
        return this.http.get<IResource>('res/admin/home/detail', {params: {id}});
    }

    public resourceSave(data: any) {
        return this.http.post<IResource>('res/admin/home/save', data);
    }

    public resourceRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('res/admin/home/delete', {params: {id}});
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

    public upload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('res/admin/home/upload', data);
    }

    public statistics() {
        return this.http.get<any>('res/admin/statistics');
    }
}
