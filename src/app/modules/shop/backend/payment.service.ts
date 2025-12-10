import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IPayment, IShipping } from '../model';

@Injectable()
export class PaymentService {
    private http = inject(HttpClient);



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

    public shippingSave(data: any) {
        return this.http.post<IShipping>('shop/admin/shipping/save', data);
    }

    public shippingRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/shipping/delete', {
            params: {
                id
            }
        });
    }

    public shippingPlugin() {
        return this.http.get<IData<IItem>>('shop/admin/shipping/plugin').pipe(map(res => res.data));
    }

    public shippingAll() {
        return this.http.get<IData<IShipping>>('shop/admin/shipping/all').pipe(map(res => res.data));
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

    public paymentSave(data: any) {
        return this.http.post<IPayment>('shop/admin/payment/save', data);
    }

    public paymentRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/payment/delete', {
            params: {
                id
            }
        });
    }

    public paymentPlugin() {
        return this.http.get<IData<IItem>>('shop/admin/payment/plugin').pipe(map(res => res.data));
    }

}
