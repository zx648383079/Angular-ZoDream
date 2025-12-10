import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { IScoreSubtotal } from '../../theme/models/seo';
import { ICategory, IComment, ISoftware, ISoftwareCheck, ISoftwareLog, ISoftwareVersion } from './model';

@Injectable({
    providedIn: 'root'
})
export class AppStoreService {
    private http = inject(HttpClient);


    public categoryList(params: any) {
        return this.http.get<IData<ICategory>>('app/category', {params});
    }

    public category(id: any) {
        return this.http.get<ICategory>('app/category/detail', {params: {id}});
    }

    public appList(params: any) {
        return this.http.get<IPage<ISoftware>>('app/software', {params});
    }

    public app(id: any) {
        return this.http.get<ISoftware>('app/software/detail', {params: {id}});
    }

    public appSuggest(params: any) {
        return this.http.get<IData<ISoftware>>('app/software/suggest', {params});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('app/comment', {params});
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('app/comment/save', data);
    }

    public scoreSubtotal(params: any) {
        return this.http.get<IScoreSubtotal>('app/comment/score_count', {params});
    }

    public scoreGrade(data: any) {
        return this.http.post<{
            avg: number;
        }>('app/comment/grade', data);
    }

    public logList(params: any) {
        return this.http.get<IPage<ISoftwareLog>>('app/software/log', {params});
    }

    public versionList(params: any) {
        return this.http.get<IPage<ISoftwareVersion>>('app/software/version', {params});
    }

    
    public appCheck(params: any) {
        return this.http.get<IPage<ISoftwareCheck>>('app/software/check', {params});
    }

    public batch(data: {
        categories?: any;
        recommend?: {
            extra?: string
        };
    }) {
        return this.http.post<{
            categories?: ICategory[];
            recommend?: ICategory[];
        }>('app/batch', data);
    }
}
