import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { ISite, ISiteCategory, ISiteCollect, ISiteCollectGroup, IWebPage } from './model';

@Injectable()
export class NavigationService {

    constructor(
        private http: HttpClient,
    ) { }


    public search(params: any) {
        return this.http.get<IPage<IWebPage>>('navigation/search', {params});
    }

    public searchSuggest(keywords: string) {
        return this.http.get<IData<string>>('navigation/search/suggest', {params: {keywords}});
    }

    public categoryAll() {
        return this.http.get<IData<ISiteCategory>>('navigation/site/category');
    }

    public siteList(params: any) {
        return this.http.get<IPage<ISite>>('navigation/site', {params});
    }

    public collectAll() {
        return this.http.get<IData<ISiteCollectGroup>>('navigation/collect')
    }

    public collectSave(data: any) {
        return this.http.post<ISiteCollect>('navigation/collect/save', data);
    }

    public collectRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/collect/delete', {params: {id}});
    }

    public groupSave(data: any) {
        return this.http.post<ISiteCollectGroup>('navigation/collect/group_save', data);
    }

    public groupRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('navigation/collect/group_delete', {params: {id}});
    }
}
