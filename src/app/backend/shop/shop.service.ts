import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../../theme/models/page';
import { IShipping, IPayment } from '../../theme/models/shop';

@Injectable()
export class ShopService {

    constructor(
        private http: HttpClient
    ) { }

    public shippingList(params: any) {
        return this.http.get<IPage<IShipping>>('shop/admin/shipping', {
            params
        });
    }

    public paymentList(params: any) {
        return this.http.get<IPage<IPayment>>('shop/admin/payment', {
            params
        });
    }
}
