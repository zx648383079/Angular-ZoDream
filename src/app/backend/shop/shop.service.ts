import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IPage } from '../../theme/models/page';
import { IShipping, IPayment} from '../../theme/models/shop';
import { map } from 'rxjs/operators';
import { IItem } from '../../theme/models/seo';

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


    public shippingList(params: any) {
        return this.http.get<IPage<IShipping>>('shop/admin/shipping', {
            params
        });
    }

    public shipping(id: any) {
        return this.http.get<IShipping>('shop/admin/shipping/detail', {
            params: {id}
        });
    }

    public shippingPlugin() {
        return this.http.get<IData<IItem>>('shop/admin/shipping/plugin').pipe(map(res => res.data));
    }

    public paymentList(params: any) {
        return this.http.get<IPage<IPayment>>('shop/admin/payment', {
            params
        });
    }

    public payment(id: any) {
        return this.http.get<IPayment>('shop/admin/payment/detail', {
            params: {id}
        });
    }

    public paymentPlugin() {
        return this.http.get<IData<IItem>>('shop/admin/payment/plugin').pipe(map(res => res.data));
    }

    public statistics() {
        return this.http.get<IData<ISubtotal>>('shop/admin/statistics').pipe(map(res => res.data));
    }
}
