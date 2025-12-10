import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, ISite, IThemeComponent } from '../model';

@Injectable({
    providedIn: 'root'
})
export class VisualService {
    private http = inject(HttpClient);


    public getNav() {
        return this.http.get<IData<ICategory>>('tpl/category');
    }

    public category(params: any) {
        return this.http.get<ICategory>('tpl/category/detail', {
            params
        });
    }

    public search(params: any) {
        return this.http.get<IPage<IThemeComponent>>('tpl/search', {
            params
        });
    }

    public searchSite(params: any) {
        return this.http.get<IPage<ISite>>('tpl/search/site', {
            params
        });
    }

    public recommend(params: any) {
        return this.http.get<IData<IThemeComponent>>('tpl/home/recommend', {
            params
        });
    }

    public mySiteList(params: any) {
        return this.http.get<IPage<ISite>>('tpl/member/site', {
            params
        });
    }

    public siteAdd(data: any) {
        return this.http.post<IDataOne<boolean>>('tpl/member/site/component_add', data);
    }

    public siteClone(data: any) {
        return this.http.post<IDataOne<boolean>>('tpl/member/site/clone', data);
    }
}
