import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IJumpLog, IPageAccessLog, ITrendLog, ITrendStatistics } from './model';

@Injectable({
    providedIn: 'root'
})
export class TrendService {
    private readonly http = inject(HttpClient);


    public trendRealTime(params: any) {
        return this.http.get<IPage<any>>('counter/trend', {
            params
        });
    }

    public trendAnalysis(params: any) {
        return this.http.get<IPage<any>>('counter/trend/analysis', {
            params
        });
    }

    public sourceList(params: any) {
        return this.http.get<IPage<any>>('counter/source', {
            params
        });
    }

    public visitList(params: any) {
        return this.http.get<IPage<any>>('counter/visit', {
            params
        });
    }

    public visitEnterList(params: any) {
        return this.http.get<IPage<any>>('counter/visit/enter', {
            params
        });
    }

    public visitDomainList(params: any) {
        return this.http.get<IPage<any>>('counter/visit/domain', {
            params
        });
    }

    public visitJumpList(params: any) {
        return this.http.get<IPage<IJumpLog>>('counter/visit/jump', {
            params
        });
    }

    public visitDistrictList(params: any) {
        return this.http.get<IData<any>>('counter/visit/district', {
            params
        });
    }

    public visitClientList(params: any) {
        return this.http.get<IData<any>>('counter/visit/client', {
            params
        });
    }

    public map(isChina = true) {
        return this.http.get<any>('counter/home/map', {
            params: {
                type: isChina ? 1: 0
            }
        });
    }

    public logList(params: any) {
        return this.http.get<IPage<IPageAccessLog>>('counter/trend/log', {
            params
        });
    }

    public logImport(data: any) {
        return this.http.post<IDataOne<boolean>>('counter/trend/log_import', data);
    }

    public analysisMask(data: any) {
        return this.http.post<IDataOne<boolean>>('counter/trend/analysis_mask', data);
    }

    public trendStatistics(type: string, compare: number) {
        return this.http.get<{
            items: ITrendStatistics[];
            compare_items: ITrendStatistics[]
        }>('counter/statistics/trend', {
            params: {type, compare}
        });
    }

 

    public batch(data: {
        today?: any;
    }) {
        return this.http.post<{
            today: any
        }>('counter/batch', data);
    }

}
