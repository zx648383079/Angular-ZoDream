import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../../../theme/models/page';
import { IOrder } from '../../../theme/models/shop';

@Injectable()
export class OrderService {

    constructor(
        private http: HttpClient
    ) { }

    public orderList(params: any) {
        return this.http.get<IPage<IOrder>>('shop/admin/order', {
            params
        });
    }

}
