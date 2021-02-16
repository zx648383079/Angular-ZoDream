import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IPage } from '../theme/models/page';
import { ICategory, IOrder, IProvider, IService, IUserRole, IWaiter } from './model';

@Injectable({
  providedIn: 'root'
})
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

    public waiterProfile() {
        return this.http.get<IWaiter>('legwork/waiter/home/index');
    }

    public waiterSave(data: any) {
        return this.http.post<IWaiter>('legwork/waiter/home/save', data);
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

    public role() {
        return this.http.get<IUserRole>('legwork/home/role');
    }
}
