import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IActivity, IActivityTime, ICoupon, ISeckillGoods } from '../model';

@Injectable()
export class ActivityService {
    private http = inject(HttpClient);


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

    public groupBuyList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/activity/group_buy', {params});
    }

    public groupBuy(params: any) {
        return this.http.get<IActivity>('shop/activity/group_buy/detail', {params});
    }

    public freeTrialList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/activity/free_trial', {params});
    }

    public freeTrial(params: any) {
        return this.http.get<IActivity>('shop/activity/free_trial/detail', {params});
    }

    public freeTrialLogList(params: any) {
        return this.http.get<IPage<any>>('shop/activity/free_trial/log', {params});
    }

    public freeTrialApply(data: any) {
        return this.http.post<any>('shop/activity/free_trial/apply', data);
    }

    public freeTrialSaveReport(data: any) {
        return this.http.post<any>('shop/activity/free_trial/report', data);
    }

    public bargainList(params: any) {
        return this.http.get<IPage<IActivity>>('shop/activity/bargain', {params});
    }

    public bargain(params: any) {
        return this.http.get<IActivity>('shop/activity/bargain/detail', {params});
    }

    public bargainLogList(params: any) {
        return this.http.get<IPage<any>>('shop/activity/bargain/log', {params});
    }

    public bargainCutLog(params: any) {
        return this.http.get<IPage<any>>('shop/activity/bargain/cut_log', {params});
    }

    public bargainCut(data: any) {
        return this.http.post<any>('shop/activity/bargain/cut', data);
    }

    public bargainApply(data: any) {
        return this.http.post<any>('shop/activity/bargain/apply', data);
    }
}
