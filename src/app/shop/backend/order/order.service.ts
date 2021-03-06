import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IDelivery, IOrder, IShipping } from '../../../theme/models/shop';
import { map } from 'rxjs';

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

    public order(id: any) {
        return this.http.get<IOrder>('shop/admin/order/detail', {
            params: {id}
        });
    }

    public orderSave(data: any) {
        return this.http.post<IOrder>('shop/admin/order/save', data);
    }

    public orderRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/admin/order/delete', {
            params: {id}
        });
    }

    public deliveryList(params: any) {
        return this.http.get<IPage<IDelivery>>('shop/admin/delivery', {
            params
        });
    }

    public delivery(id: any) {
        return this.http.get<IDelivery>('shop/admin/delivery/detail', {
            params: {id}
        });
    }

    public deliverySave(data: any) {
        return this.http.post<IDelivery>('shop/admin/delivery/save', data);
    }

    public deliveryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/admin/delivery/delete', {
            params: {id}
        });
    }

    public shippingAll() {
        return this.http.get<IData<IShipping>>('shop/admin/shipping/all').pipe(map(res => res.data));
    }
}
