import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IPage, IDataOne } from '../../../theme/models/page';
import { IChannel, IProduct, ITradeLog } from '../model';

@Injectable()
export class TrackerBackendService {
    private http = inject(HttpClient);


    public channelList(params: any) {
        return this.http.get<IPage<IChannel>>('tracker/admin/product/channel', {params});
    }

    public channelSave(data: any) {
        return this.http.post<IChannel>('tracker/admin/product/channel_save', data);
    }

    public channelRemove(id: any) {
        return this.http.delete<IDataOne<true>>('tracker/admin/product/channel_delete', {
          params: {id}
        });
    }

    public productList(params: any) {
        return this.http.get<IPage<IProduct>>('tracker/admin/product', {params});
    }

    public productSave(data: any) {
        return this.http.post<IProduct>('tracker/admin/product/save', data);
    }

    public productRemove(id: any) {
        return this.http.delete<IDataOne<true>>('tracker/admin/product/delete', {
          params: {id}
        });
    }

    public logList(params: any) {
        return this.http.get<IPage<ITradeLog>>('tracker/admin/log', {params});
    }

    public logAdd(data: any) {
        return this.http.post<IDataOne<true>>('tracker/admin/log/add', data);
    }

    public logRemove(id: any) {
        return this.http.delete<IDataOne<true>>('tracker/admin/log/delete', {
          params: {id}
        });
    }

    public statistics() {
        return this.http.get<any>('tracker/admin/statistics');
    }
}
