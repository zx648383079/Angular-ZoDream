import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { ISite, ISiteCategory, ISiteCollect, ISiteCollectGroup, IWebPage } from './model';

@Injectable()
export class NavigationService {
    private http = inject(HttpClient);



    public search(params: any) {
        return this.http.get<IPage<IWebPage>>('navigation/search', {params});
    }

    public searchSuggest(keywords: string) {
        return this.http.get<IData<string>>('navigation/search/suggest', {params: {keywords}});
    }

    public categoryAll() {
        return this.http.get<IData<ISiteCategory>>('navigation/site/category');
    }

    public categoryRecommend(category = 0) {
        return this.http.get<IData<ISiteCategory>>('navigation/site/category_recommend', {params: {category}});
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

    public collectBatchSave(data: ISiteCollectGroup[]) {
        return this.http.post<IData<ISiteCollectGroup>>('navigation/collect/batch_save', {data});
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

    public report(data: any) {
        return this.http.post<IDataOne<boolean>>('navigation/report', data);
    }

    public batch(data: {
        site_category?: any;
        site_recommend?: {
            category?: number
        };
    }) {
        return this.http.post<{
            site_category?: ISiteCategory[];
            site_recommend?: ISiteCategory[];
        }>('navigation/batch', data);
    }
}
