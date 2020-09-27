import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { map } from 'rxjs/operators';

export interface ISubtotal {
    name: string;
    label: string;
    count: number;
}

@Injectable()
export class ShopService {

    constructor(
        private http: HttpClient
    ) { }


    public statistics() {
        return this.http.get<IData<ISubtotal>>('shop/admin/statistics').pipe(map(res => res.data));
    }
}
