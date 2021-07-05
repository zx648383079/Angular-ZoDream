import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IActivity, IActivityTime, ICoupon, ISeckillGoods } from '../../theme/models/shop';

@Injectable()
export class ActivityService {

    constructor(
        private http: HttpClient,
    ) { }

    public seckillTime() {
        return this.http.get<IData<IActivityTime>>('shop/activity/seckill/time');
    }

    public seckillList(params: any) {
        return this.http.get<IPage<ISeckillGoods>>('shop/activity/seckill/goods', {params});
    }

    public couponList(params: any) {
        return this.http.get<IPage<ICoupon>>('shop/coupon', {params});
    }

    public couponReceive(id: number) {
        return this.http.post<IDataOne<boolean>>('shop/coupon/receive', {id});
    }

    public auctionList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/activity/auction', {params});
    }

    public auction(params: any) {
        return this.http.get<IActivity>('shop/activity/auction/detail', {params});
    }

    public auctionLogList(params: any) {
        return this.http.get<IPage<any>>('shop/activity/auction/log', {params});
    }

    public auctionBid(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/activity/auction/bid', data);
    }

    public presaleList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/activity/presale', {params});
    }

    public presale(params: any) {
        return this.http.get<IActivity>('shop/activity/presale/detail', {params});
    }

    public mixList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/activity/mix', {params});
    }
}
