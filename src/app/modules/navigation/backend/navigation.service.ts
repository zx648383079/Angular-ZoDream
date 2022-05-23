import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ISite, ISiteCategory, ISiteTag, IWebPage, IWebPageKeywords } from '../model';

@Injectable()
export class NavigationService {

    constructor(
        private http: HttpClient
    ) { }

    public categoryList(params: any) {
        return this.http.get<IPage<ISiteCategory>>('navigation/admin/category', {params});
    }

    public categoryTree() {
        return this.http.get<IData<ISiteCategory>>('navigation/admin/category/all');
    }

    public category(id: any) {
        return this.http.get<ISiteCategory>('navigation/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ISiteCategory>('navigation/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/admin/category/delete', {params: {id}});
    }

    public siteList(params: any) {
        return this.http.get<IPage<ISite>>('navigation/admin/site', {params});
    }

    public site(id: any) {
        return this.http.get<ISite>('navigation/admin/site/detail', {params: {id}});
    }

    public siteSave(data: any) {
        return this.http.post<ISite>('navigation/admin/site/save', data);
    }

    public siteRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/admin/site/delete', {params: {id}});
    }

    public siteScoring(data: any) {
        return this.http.post<ISite>('navigation/admin/site/scoring', data);
    }

    public tagList(params: any) {
        return this.http.get<IPage<ISiteTag>>('navigation/admin/tag', {params});
    }

    public tagSave(data: any) {
        return this.http.post<ISiteTag>('navigation/admin/tag/save', data);
    }

    public tagRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/admin/tag/delete', {params: {id}});
    }

    public keywordList(params: any) {
        return this.http.get<IPage<IWebPageKeywords>>('navigation/admin/keyword', {params});
    }

    public keywordSave(data: any) {
        return this.http.post<IWebPageKeywords>('navigation/admin/keyword/save', data);
    }

    public keywordRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/admin/keyword/delete', {params: {id}});
    }


    public pageList(params: any) {
        return this.http.get<IPage<IWebPage>>('navigation/admin/page', {params});
    }

    public page(id: any) {
        return this.http.get<IWebPage>('navigation/admin/page/detail', {params: {id}});
    }

    public pageSave(data: any) {
        return this.http.post<IWebPage>('navigation/admin/page/save', data);
    }

    public pageRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/admin/page/delete', {params: {id}});
    }

    public statistics() {
        return this.http.get<any>('navigation/admin/statistics');
    }

}
