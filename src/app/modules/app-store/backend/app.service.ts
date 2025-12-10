import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IUploadResult } from '../../../theme/models/open';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IComment, ISoftware, ISoftwarePackage, ISoftwareVersion, ITag } from '../model';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private http = inject(HttpClient);


    public categoryTree() {
        return this.http.get<IData<ICategory>>('app/admin/category/all');
    }

    public category(id: any) {
        return this.http.get<ICategory>('app/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('app/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('app/admin/category/delete', {params: {id}});
    }

    public softwareList(params: any) {
        return this.http.get<IPage<ISoftware>>('app/admin/software', {params});
    }

    public software(id: any, version?: any) {
        const data: any = {id};
        if (version) {
            data.version = version;
        }
        return this.http.get<ISoftware>('app/admin/software/detail', {params: data});
    }

    public softwareSave(data: any) {
        return this.http.post<ISoftware>('app/admin/software/save', data);
    }

    public softwareRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('app/admin/software/delete', {params: {id}});
    }

    public versionList(params: any) {
        return this.http.get<IPage<ISoftwareVersion>>('app/admin/software/version', {params});
    }

    public versionSave(data: any) {
        return this.http.post<ISoftwareVersion>('app/admin/software/version_new', data);
    }

    public versionRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('app/admin/software/version_delete', {params: {id}});
    }

    public packageList(params: any) {
        return this.http.get<IPage<ISoftwarePackage>>('app/admin/software/package', {params});
    }

    public packageSave(data: any) {
        return this.http.post<ISoftwarePackage>('app/admin/software/package_save', data);
    }

    public packageRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('app/admin/software/package_delete', {params: {id}});
    }

    public tagList(params: any) {
        return this.http.get<IPage<ITag>>('app/admin/tag', {params});
    }

    public tagRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('app/admin/tag/delete', {params: {id}});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('app/admin/comment', {params});
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('app/admin/comment/delete', {params: {id}});
    }

    public upload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('app/admin/software/upload', data);
    }

    public statistics() {
        return this.http.get<any>('app/admin/statistics');
    }
}
