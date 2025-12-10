import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IOrder, IProvider, IService, IWaiter } from '../model';

@Injectable()
export class LegworkService {
    private http = inject(HttpClient);


    public categoryList(params: any) {
        return this.http.get<IPage<ICategory>>('legwork/admin/category', {params});
    }

    public category(id: any) {
        return this.http.get<ICategory>('legwork/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('legwork/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('legwork/admin/category/delete', {params: {id}});
    }

    public orderList(params: any) {
        return this.http.get<IPage<IOrder>>('legwork/admin/order', {params});
    }

    public providerList(params: any) {
        return this.http.get<IPage<IProvider>>('legwork/admin/provider', {params});
    }

    public providerChange(id: number, status: number) {
        return this.http.post<IProvider>('legwork/admin/provider/change', {id, status});
    }

    public providerCategories(id: any) {
        return this.http.get<IData<ICategory>>('legwork/admin/provider/category', {params: {id}});
    }


    public providerCategoryChange(id: number, category: number|number[], status: number) {
        return this.http.post<IDataOne<boolean>>('legwork/admin/provider/change_category', {id, category, status});
    }

    public waiterList(params: any) {
        return this.http.get<IPage<IWaiter>>('legwork/admin/waiter', {params});
    }

    public waiterChange(id: number, status: number) {
        return this.http.post<IWaiter>('legwork/admin/waiter/change', {id, status});
    }

    public serviceList(params: any) {
        return this.http.get<IPage<IService>>('legwork/admin/service', {params});
    }

    public serviceChange(id: number, status: number) {
        return this.http.post<IWaiter>('legwork/admin/service/change', {id, status});
    }

    public statistics() {
        return this.http.get<any>('legwork/admin/statistics');
    }
}
