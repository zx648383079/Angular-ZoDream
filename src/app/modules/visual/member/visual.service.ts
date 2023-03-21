import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, ISite, ISiteComponent, ISitePage, IThemeComponent } from '../model';
import { IUploadResult } from '../../../theme/models/open';

@Injectable({
  providedIn: 'root'
})
export class VisualService {

    constructor(
        private http: HttpClient,
    ) { }


    public search(params: any) {
        return this.http.get<IPage<IThemeComponent>>('tpl/search', {
            params
        });
    }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('tpl/category/all');
    }

    public componentList(params: any) {
        return this.http.get<IPage<IThemeComponent>>('tpl/member/component', {params});
    }

    public component(id: any) {
        return this.http.get<IThemeComponent>('tpl/member/component/detail', {params: {id}});
    }

    public componentSave(data: any) {
        return this.http.post<IThemeComponent>('tpl/member/component/save', data);
    }

    public componentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/component/delete', {params: {id}});
    }

    public siteList(params: any) {
        return this.http.get<IPage<ISite>>('tpl/member/site', {params});
    }

    public siteSave(data: any) {
        return this.http.post<ISite>('tpl/member/site/save', data);
    }

    public siteRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/site/delete', {params: {id}});
    }

    public sitePageList(params: any) {
        return this.http.get<IPage<ISitePage>>('tpl/member/site/page', {params});
    }

    public sitePageSave(data: any) {
        return this.http.post<ISitePage>('tpl/member/site/page_save', data);
    }

    public sitePageRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/site/page_delete', {params: {id}});
    }

    public siteComponentList(params: any) {
        return this.http.get<IPage<ISiteComponent>>('tpl/member/site/component', {params});
    }

    public siteComponentAdd(data: any) {
        return this.http.post<ISite>('tpl/member/site/component_add', data);
    }

    public siteComponentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tpl/member/site/component_delete', {params: {id}});
    }


    public upload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('tpl/member/component/upload', data);
    }
}
