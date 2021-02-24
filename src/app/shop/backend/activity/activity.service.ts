import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { IActivity } from '../../../theme/models/shop';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

    constructor(
        private http: HttpClient
    ) { }

    public auctionList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/admin/activity/auction', {
            params,
        });
    }

    public auction(id: any) {
        return this.http.get<IActivity>('shop/admin/activity/auction/detail', {
            params: {
                id
            },
        });
    }

    public auctionSave(data: any) {
        return this.http.post<IActivity>('shop/admin/activity/auction/save', data);
    }

    public auctionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/auction/delete', {
            params: {
                id
            }
        });
    }
}
