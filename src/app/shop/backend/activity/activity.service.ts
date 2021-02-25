import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { IActivity, IAuctionConfigure, IBargainConfigure } from '../../../theme/models/shop';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

    constructor(
        private http: HttpClient
    ) { }

    public auctionList(params: any) {
        return this.http.get<IPage<IActivity<IAuctionConfigure>>>('shop/admin/activity/auction', {
            params,
        });
    }

    public auction(id: any) {
        return this.http.get<IActivity<IAuctionConfigure>>('shop/admin/activity/auction/detail', {
            params: {
                id
            },
        });
    }

    public auctionSave(data: any) {
        return this.http.post<IActivity<IAuctionConfigure>>('shop/admin/activity/auction/save', data);
    }

    public auctionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/auction/delete', {
            params: {
                id
            }
        });
    }

    public bargainList(params: any) {
        return this.http.get<IPage<IActivity<IBargainConfigure>>>('shop/admin/activity/bargain', {
            params,
        });
    }

    public bargain(id: any) {
        return this.http.get<IActivity<IBargainConfigure>>('shop/admin/activity/bargain/detail', {
            params: {
                id
            },
        });
    }

    public bargainSave(data: any) {
        return this.http.post<IActivity<IBargainConfigure>>('shop/admin/activity/bargain/save', data);
    }

    public bargainRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/bargain/delete', {
            params: {
                id
            }
        });
    }


    public cashBackList(params: any) {
        return this.http.get<IPage<IActivity<IBargainConfigure>>>('shop/admin/activity/cash_back', {
            params,
        });
    }

    public cashBack(id: any) {
        return this.http.get<IActivity<IBargainConfigure>>('shop/admin/activity/cash_back/detail', {
            params: {
                id
            },
        });
    }

    public cashBackSave(data: any) {
        return this.http.post<IActivity<IBargainConfigure>>('shop/admin/activity/cash_back/save', data);
    }

    public cashBackRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/cash_back/delete', {
            params: {
                id
            }
        });
    }
}
