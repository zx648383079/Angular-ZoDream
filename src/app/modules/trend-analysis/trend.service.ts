import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IData, IPage } from '../../theme/models/page';
import { IJumpLog, ITrendStatistics } from './model';

@Injectable({
    providedIn: 'root'
})
export class TrendService {

    constructor(
        private http: HttpClient
    ) { }

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
