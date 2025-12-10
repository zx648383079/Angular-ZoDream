import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, ISite, ISitePage, IThemeComponent } from '../model';
import { IUploadResult } from '../../../theme/models/open';

@Injectable({
  providedIn: 'root'
})
export class VisualService {
    private http = inject(HttpClient);



    public categoryTree() {
        return this.http.get<IData<ICategory>>('tpl/admin/category/all');
    }

    public categoryList() {
        return this.http.get<IData<ICategory>>('tpl/admin/category');
    }

    public category(id: any) {
        return this.http.get<ICategory>('tpl/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('tpl/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/admin/category/delete', {params: {id}});
    }

    public componentList(params: any) {
        return this.http.get<IPage<IThemeComponent>>('tpl/admin/component', {params});
    }

    public component(id: any) {
        return this.http.get<IThemeComponent>('tpl/admin/component/detail', {params: {id}});
    }

    public componentSave(data: any) {
        return this.http.post<IThemeComponent>('tpl/admin/component/save', data);
    }

    public componentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/admin/component/delete', {params: {id}});
    }

    public componentReview(id: any, data: any) {
        return this.http.post<IDataOne<boolean>>('tpl/admin/component/review', {id, data});
    }

    public siteList(params: any) {
        return this.http.get<IPage<ISite>>('tpl/admin/site', {params});
    }

    public siteToggle(data: any) {
        return this.http.post<ISite>('tpl/admin/site/toggle', data);
    }

    public siteRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/admin/site/delete', {params: {id}});
    }

    public sitePageList(params: any) {
        return this.http.get<IPage<ISitePage>>('tpl/admin/site/page', {params});
    }

    public sitePageToggle(data: any) {
        return this.http.post<ISitePage>('tpl/admin/site/page_toggle', data);
    }

    public sitePageRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/admin/site/page_delete', {params: {id}});
    }


    public upload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('tpl/admin/component/upload', data);
    }

    public statistics() {
        return this.http.get<any>('tpl/admin/statistics');
    }
}
