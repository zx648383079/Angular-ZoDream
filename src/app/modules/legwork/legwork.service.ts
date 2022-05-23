import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { ICategory, IOrder, IProvider, IService, IUserRole, IWaiter } from './model';

@Injectable()
export class LegworkService {

    constructor(private http: HttpClient) { }

    public categoryList() {
        return this.http.get<IData<ICategory>>('legwork/home/category');
    }

    public providerCategory() {
        return this.http.get<IData<ICategory>>('legwork/provider/service/category');
    }

    public serviceList(params: any) {
        return this.http.get<IPage<IService>>('legwork', {params});
    }

    public service(id: any) {
        return this.http.get<IService>('legwork/home/detail', {params: {id}});
    }

    public orderList(params: any) {
        return this.http.get<IPage<IOrder>>('legwork/order', {params});
    }

    public orderCancel(id: number) {
        return this.http.post<IDataOne<boolean>>('legwork/order/cancel', {id});
    }

    public orderComment(data: any) {
        return this.http.post<IDataOne<boolean>>('legwork/order/comment', data);
    }

    public orderPay(id: number) {
        return this.http.post<IDataOne<any>>('legwork/order/pay', {id});
    }

    public orderCreate(data: any) {
        return this.http.post<any>('legwork/order/create', data);
    }

    public waiterProfile() {
        return this.http.get<IWaiter>('legwork/waiter/home/index');
    }

    public waiterSave(data: any) {
        return this.http.post<IWaiter>('legwork/waiter/home/save', data);
    }

    public waiterServiceList(params: any) {
        return this.http.get<IPage<IService>>('legwork/waiter/service', {params});
    }

    public waiterServiceApply(id: number| number[]) {
        return this.http.post<IDataOne<boolean>>('legwork/waiter/service/apply', {id});
    }

    public waiterOrderList(params: any) {
        return this.http.get<IPage<IOrder>>('legwork/waiter/order', {params});
    }

    public waitingOrderList(params: any) {
        return this.http.get<IPage<IOrder>>('legwork/waiter/order/waiting', {params});
    }

    public waiterTaking(id: number) {
        return this.http.post<IDataOne<boolean>>('legwork/waiter/order/taking', {id});
    }

    public waiterTaken(id: number) {
        return this.http.post<IDataOne<boolean>>('legwork/waiter/order/taken', {id});
    }

    public providerProfile() {
        return this.http.get<IProvider>('legwork/provider/home/index');
    }

    public providerSave(data: any) {
        return this.http.post<IProvider>('legwork/provider/home/save', data);
    }

    public providerServiceList(params: any) {
        return this.http.get<IPage<IService>>('legwork/provider/service', {params});
    }

    public providerService(id: any) {
        return this.http.get<IService>('legwork/provider/service/detail', {params: {id}});
    }

    public providerServiceSave(data: any) {
        return this.http.post<IService>('legwork/provider/service/save', data);
    }

    public providerServiceRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('legwork/provider/service/delete', {params: {id}});
    }

    public providerWaiterList(params: any) {
        return this.http.get<IPage<IUser>>('legwork/provider/service/waiter', {params});
    }

    public providerWaiterChange(data: any) {
        return this.http.post<IDataOne<boolean>>('legwork/provider/service/waiter_change', data);
    }

    public providerOrderList(params: any) {
        return this.http.get<IPage<IOrder>>('legwork/provider/order', {params});
    }

    public role() {
        return this.http.get<IUserRole>('legwork/home/role');
    }
}
