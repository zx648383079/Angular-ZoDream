import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../../theme/models/page';
import {
    IActivity, IActivityTime, IAuctionConfigure, IBargainConfigure, ICashBackConfigure,
    ICoupon, ICouponLog, IDiscountConfigure, IFreeTrialConfigure, IGroupBuyConfigure,
    ILotteryConfigure, 
    IMixConfigure,
    IPreSaleConfigure,
    ISeckillGoods,
    IWholesaleConfigure} from '../../model';

@Injectable()
export class ActivityService {
    private http = inject(HttpClient);


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
        return this.http.get<IPage<IActivity<ICashBackConfigure>>>('shop/admin/activity/cash_back', {
            params,
        });
    }

    public cashBack(id: any) {
        return this.http.get<IActivity<ICashBackConfigure>>('shop/admin/activity/cash_back/detail', {
            params: {
                id
            },
        });
    }

    public cashBackSave(data: any) {
        return this.http.post<IActivity<ICashBackConfigure>>('shop/admin/activity/cash_back/save', data);
    }

    public cashBackRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/cash_back/delete', {
            params: {
                id
            }
        });
    }


    public couponList(params: any) {
        return this.http.get<IPage<ICoupon>>('shop/admin/activity/coupon', {
            params,
        });
    }

    public coupon(id: any) {
        return this.http.get<ICoupon>('shop/admin/activity/coupon/detail', {
            params: {
                id
            },
        });
    }

    public couponSave(data: any) {
        return this.http.post<ICoupon>('shop/admin/activity/coupon/save', data);
    }

    public couponRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/coupon/delete', {
            params: {
                id
            }
        });
    }

    public couponCodeList(params: any) {
        return this.http.get<IPage<ICouponLog>>('shop/admin/activity/coupon/code', {
            params,
        });
    }

    public couponCodeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/coupon/code_delete', {
            params: {
                id
            }
        });
    }

    public couponCodeGenerate(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/admin/activity/coupon/code_generate', data);
    }

    public couponCodeImport(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/admin/activity/coupon/code_import', data);
    }

    public discountList(params: any) {
        return this.http.get<IPage<IActivity<IDiscountConfigure>>>('shop/admin/activity/discount', {
            params,
        });
    }

    public discount(id: any) {
        return this.http.get<IActivity<IDiscountConfigure>>('shop/admin/activity/discount/detail', {
            params: {
                id
            },
        });
    }

    public discountSave(data: any) {
        return this.http.post<IActivity<IDiscountConfigure>>('shop/admin/activity/discount/save', data);
    }

    public discountRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/discount/delete', {
            params: {
                id
            }
        });
    }

    public freeTrialList(params: any) {
        return this.http.get<IPage<IActivity<IFreeTrialConfigure>>>('shop/admin/activity/free_trial', {
            params,
        });
    }

    public freeTrial(id: any) {
        return this.http.get<IActivity<IFreeTrialConfigure>>('shop/admin/activity/free_trial/detail', {
            params: {
                id
            },
        });
    }

    public freeTrialSave(data: any) {
        return this.http.post<IActivity<IFreeTrialConfigure>>('shop/admin/activity/free_trial/save', data);
    }

    public freeTrialRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/free_trial/delete', {
            params: {
                id
            }
        });
    }

    public groupBuyList(params: any) {
        return this.http.get<IPage<IActivity<IGroupBuyConfigure>>>('shop/admin/activity/group_buy', {
            params,
        });
    }

    public groupBuy(id: any) {
        return this.http.get<IActivity<IGroupBuyConfigure>>('shop/admin/activity/group_buy/detail', {
            params: {
                id
            },
        });
    }

    public groupBuySave(data: any) {
        return this.http.post<IActivity<IGroupBuyConfigure>>('shop/admin/activity/group_buy/save', data);
    }

    public groupBuyRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/group_buy/delete', {
            params: {
                id
            }
        });
    }

    public lotteryList(params: any) {
        return this.http.get<IPage<IActivity<ILotteryConfigure>>>('shop/admin/activity/lottery', {
            params,
        });
    }

    public lottery(id: any) {
        return this.http.get<IActivity<ILotteryConfigure>>('shop/admin/activity/lottery/detail', {
            params: {
                id
            },
        });
    }

    public lotterySave(data: any) {
        return this.http.post<IActivity<ILotteryConfigure>>('shop/admin/activity/lottery/save', data);
    }

    public lotteryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/lottery/delete', {
            params: {
                id
            }
        });
    }

    public mixList(params: any) {
        return this.http.get<IPage<IActivity<IMixConfigure>>>('shop/admin/activity/mix', {
            params,
        });
    }

    public mix(id: any) {
        return this.http.get<IActivity<IMixConfigure>>('shop/admin/activity/mix/detail', {
            params: {
                id
            },
        });
    }

    public mixSave(data: any) {
        return this.http.post<IActivity<IMixConfigure>>('shop/admin/activity/mix/save', data);
    }

    public mixRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/mix/delete', {
            params: {
                id
            }
        });
    }

    public presaleList(params: any) {
        return this.http.get<IPage<IActivity<IPreSaleConfigure>>>('shop/admin/activity/presale', {
            params,
        });
    }

    public presale(id: any) {
        return this.http.get<IActivity<IPreSaleConfigure>>('shop/admin/activity/presale/detail', {
            params: {
                id
            },
        });
    }

    public presaleSave(data: any) {
        return this.http.post<IActivity<IPreSaleConfigure>>('shop/admin/activity/presale/save', data);
    }

    public presaleRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/presale/delete', {
            params: {
                id
            }
        });
    }

    public seckillList(params: any) {
        return this.http.get<IPage<IActivity<any>>>('shop/admin/activity/seckill', {
            params,
        });
    }

    public seckill(id: any) {
        return this.http.get<IActivity<any>>('shop/admin/activity/seckill/detail', {
            params: {
                id
            },
        });
    }

    public seckillSave(data: any) {
        return this.http.post<IActivity<any>>('shop/admin/activity/seckill/save', data);
    }

    public seckillRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/seckill/delete', {
            params: {
                id
            }
        });
    }

    public timeList() {
        return this.http.get<IData<IActivityTime>>('shop/admin/activity/seckill/time');
    }

    public timeSave(data: any) {
        return this.http.post<IActivityTime>('shop/admin/activity/seckill/save_time', data);
    }

    public timeRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/seckill/delete_time', {
            params: {
                id
            }
        });
    }

    public goodsList(params: any) {
        return this.http.get<IPage<ISeckillGoods>>('shop/admin/activity/seckill/goods', {
            params,
        });
    }

    public goodsSave(data: any) {
        return this.http.post<ISeckillGoods>('shop/admin/activity/seckill/save_goods', data);
    }

    public goodsRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/seckill/delete_goods', {
            params: {
                id
            }
        });
    }

    public wholesaleList(params: any) {
        return this.http.get<IPage<IActivity<IWholesaleConfigure>>>('shop/admin/activity/wholesale', {
            params,
        });
    }

    public wholesale(id: any) {
        return this.http.get<IActivity<IWholesaleConfigure>>('shop/admin/activity/wholesale/detail', {
            params: {
                id
            },
        });
    }

    public wholesaleSave(data: any) {
        return this.http.post<IActivity<IWholesaleConfigure>>('shop/admin/activity/wholesale/save', data);
    }

    public wholesaleRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/activity/wholesale/delete', {
            params: {
                id
            }
        });
    }
}
