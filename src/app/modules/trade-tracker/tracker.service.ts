import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { ILastestLog, IProduct, ITradeLog } from './model';

@Injectable({
    providedIn: 'root'
})
export class TrackerService {
    private http = inject(HttpClient);



    public logList(params: any) {
        return this.http.get<IPage<ILastestLog>>('tracker/log', {params});
    }

    public product(id: any) {
        return this.http.get<IProduct>('tracker/product/detail', {params: {id}})
    }

    public productPrice(id: any) {
        return this.http.get<IData<ITradeLog>>('tracker/product/price', {params: {id}})
    }

    public productChart(params: any) {
        return this.http.get<IData<ITradeLog>>('tracker/product/chart', {params});
    }

    public productSuggestion(params: any) {
        return this.http.get<IData<string>>('tracker/product/suggest', {params})
    }
}
