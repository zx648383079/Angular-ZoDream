import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccountLog, IBulletinUser, IConnect, ILoginLog } from '../../theme/models/auth';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { ISite } from '../../theme/models/seo';
import {
    IAd, IAddress, IArticle, IArticleCategory,
    IBrand, ICart, ICartDialog, ICartItem, ICashierData, ICategory, ICollect, IComment,
    ICommentSubtotal, ICoupon, IGoods, IHomeProduct, IOrder, IOrderCount,
    IPayment, IShipping
} from './model';
import { IUser } from '../../theme/models/user';

const REGION_KEY = 'region';

@Injectable({
    providedIn: 'root',
})
export class ShopService {

    private _regionId = 0;

    constructor(
        private http: HttpClient
    ) {
        this._regionId = parseInt(window.localStorage.getItem(REGION_KEY), 10) || 0;
    }

    public get regionId() {
        return this._regionId;
    }

    public set regionId(id: number) {
        window.localStorage.setItem(REGION_KEY, id.toString());
        this._regionId = id;
    }

    public categories(parent: any = 0) {
        return this.http.get<IData<ICategory>>('shop/category', {
            params: {parent}
        });
    }

    public category(id: any) {
        return this.http.get<ICategory>('shop/category', {
            params: {id}
        });
    }

    public categoriesLevel() {
        return this.http.get<IData<ICategory>>('shop/category/level');
    }

    public categoriesTree() {
        return this.http.get<IData<ICategory>>('shop/category/tree');
    }

    public goodsList(params: any) {
        return this.http.get<IPage<IGoods>>('shop/goods', {
            params
        });
    }

    public goods(id: any, product?: any) {
        return this.http.get<IGoods>('shop/goods/info', {
            params: {id, product, region: this.regionId}
        });
    }

    public goodsStock(id: any) {
        return this.http.get<IGoods>('shop/goods/stock', {
            params: {id, region: this.regionId}
        });
    }

    /**
     * toggleCollect
     */
    public toggleCollect(id: any) {
        return this.http.post<IDataOne<boolean>>('shop/collect/toggle', {id});
    }

    public homeList() {
        return this.http.get<IHomeProduct>('shop/goods/home');
    }

    public recommendList(id: any) {
        return this.http.get<IData<IGoods>>('shop/goods/recommend', {
            params: {id}
        });
    }

    public hotList(id: any) {
        return this.http.get<IData<IGoods>>('shop/goods/hot', {
            params: {id}
        });
    }

    public hotKeywords() {
        return this.http.get<IData<string>>('shop/search/keywords');
    }

    public cartRecommendList() {
        return this.http.get<IData<IGoods>>('shop/cart/recommend');
    }

    public searchTips(keywords: string) {
        return this.http.get<IData<string>>('shop/search/tips', {params: {keywords}});
    }

    public cart(params?: any) {
        return this.http.get<ICart>('shop/cart', {params});
    }

    public cartAddGoods(goods: number, amount: number = 1, properties = []) {
        return this.http.post<ICart|ICartDialog>('shop/cart/add', {
            goods,
            amount,
            properties,
        });
    }

    public cartUpdateGoods(goods: number, amount: number = 1, properties = []) {
        return this.http.post<ICart|ICartDialog>('shop/cart/update_goods', {
            goods,
            amount,
            properties,
        });
    }

    public cartUpdateItem(id: number, amount: number = 1) {
        return this.http.put<ICart>('shop/cart/update', {
            id,
            amount,
        });
    }

    public cartDeleteItem(id: any)  {
        return this.http.delete<ICart>('shop/cart/delete', {params: {id}});
    }

    public cartDeleteAll() {
        return this.http.post<ICart>('shop/cart/clear', {});
    }

    public cartDeleteInvalid() {
        return this.http.post<ICart>('shop/cart/delete_invalid', {});
    }

    public paymentList(goods?: number[] | ICartItem[], shipping?: number, type = 0) {
        return this.http.post<IData<IPayment>>('shop/cashier/payment', {goods, shipping, type});
    }

    public shippingList(goods: number[] | ICartItem[], address: number, type: number = 0) {
        return this.http.post<IData<IShipping>>('shop/cashier/shipping', {goods, address, type});
    }

    public orderCouponList(goods: number[] | ICartItem[], type: number = 0) {
        return this.http.post<IData<ICoupon>>('shop/cashier/coupon', {goods, type});
    }

    public previewOrder(data: ICashierData) {
        return this.http.post<IOrder>('shop/cashier/preview', data);
    }

    public checkoutOrder(data: ICashierData) {
        return this.http.post<IOrder>('shop/cashier/checkout', data);
    }

    public site() {
        return this.http.get<ISite>('shop');
    }

    public articleList(params: any) {
        return this.http.get<IPage<IArticle>>('shop/article', {params});
    }

    public article(id: any) {
        return this.http.get<IArticle>('shop/article', {params: {id}});
    }

    public help() {
        return this.http.get<IData<IArticleCategory|IArticle>>('shop/article/help');
    }

    public notice() {
        return this.http.get<IData<IArticle>>('shop/article/notice');
    }

    public articleCategories(parentId: any) {
        return this.http.get<IData<IArticleCategory>>('shop/article/category', {params: {parent_id: parentId}});
    }

    public adList(position: any) {
        return this.http.get<IData<IAd>>('shop/ad', {params: {position}});
    }

    public banners() {
        return this.http.get<IData<IAd>>('shop/ad/banner');
    }

    public brandList(params: any) {
        return this.http.get<IPage<IBrand>>('shop/brand', {params});
    }

    public brandRecommend() {
        return this.http.get<IData<IBrand>>('shop/brand/recommend');
    }

    public categoryfloor() {
        return this.http.get<IData<ICategory>>('shop/category/floor');
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('shop/comment', {params});
    }

    public commentSubtotal(itemId: number, itemType?: number) {
        return this.http.get<ICommentSubtotal>('shop/comment/count', {params: {item_id: itemId as any, item_type: itemType as any}});
    }

    public commentRecommend() {
        return this.http.get<IData<IComment>>('shop/comment/recommend');
    }

    public profile() {
        return this.http.get<IUser>('auth/user');
    }

    public orderList(params: any) {
        return this.http.get<IPage<IOrder>>('shop/order', {params});
    }

    public order(id: any) {
        return this.http.get<IOrder>('shop/order', {params: {id}});
    }

    public orderRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/order/delete', {params: {id}});
    }

    public orderCancel(id: any) {
        return this.http.delete<IOrder>('shop/order/cancel', {params: {id}});
    }

    public orderRepurchase(id: any) {
        return this.http.get<IDataOne<boolean>>('shop/order/repurchase', {params: {id}});
    }

    public orderSubtotal() {
        return this.http.get<IOrderCount>('shop/order/count');
    }

    public addressList(params: any) {
        return this.http.get<IPage<IAddress>>('shop/address', {params});
    }

    public address(id: any) {
        return this.http.get<IAddress>('shop/address', {params: {id}});
    }

    public addressSave(data: any) {
        return this.http.post<IAddress>('shop/address/update', data);
    }

    public addressRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/address/delete', {params: {id}});
    }

    public addressDefault(id: any) {
        return this.http.put<IDataOne<boolean>>('shop/address/default', {params: {id}});
    }

    public accountLog(params: any) {
        return this.http.get<IPage<IAccountLog>>('auth/account/log', {
            params,
        });
    }

    public loginLog(params: any) {
        return this.http.get<IPage<ILoginLog>>('auth/account/login_log', {
            params,
        });
    }

    public bulletinUser() {
        return this.http.get<IData<IUser>>('auth/bulletin/user');
    }

    public bulletinList(params: any) {
        return this.http.get<IPage<IBulletinUser>>('auth/bulletin', {
            params,
        });
    }

    public connect() {
        return this.http.get<IData<IConnect>>('auth/account/connect');
    }

    public uploadAvatar(file: File) {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<IUser>('auth/user/avatar', form);
    }

    public passwordUpdate(data: any) {
        return this.http.post<IDataOne<boolean>>('auth/password/update', data);
    }


    public updateProfile(data: any) {
        return this.http.post<IUser>('auth/user/update', data);
    }

    public updateAccount(data: any) {
        return this.http.post<IUser>('auth/user/update_account', data);
    }

    public sendCode(data: {
        to_type: 'mobile'|'email',
        to?: string;
        event: string;
    }) {
        return this.http.post<IDataOne<boolean>>('auth/password/send_code', data);
    }
    public verifyCode(data: {
        to_type: 'mobile'|'email',
        to?: string;
        code: string;
        event: string;
    }) {
        return this.http.post<IDataOne<boolean>>('auth/password/verify_code', data);
    }

    public collectList(params: any) {
        return this.http.get<IPage<ICollect>>('shop/collect', {params});
    }

    public collectRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/collect/delete', {params: {id}});
    }

    public couponMyList(params: any) {
        return this.http.get<IPage<ICoupon>>('shop/coupon/my', {params});
    }

    public couponReceive(id: number) {
        return this.http.post<IDataOne<boolean>>('shop/coupon/receive', {id});
    }

    public couponExchange(code: string) {
        return this.http.post<IDataOne<boolean>>('shop/coupon/exchange', {code});
    }

    public batch(data: {
        category?: any;
        brand?: any;
        cart?: any;
        hot_keywords?: any;
        notice?: any;
        help?: any;
    }) {
        return this.http.post<{
            category?: ICategory[];
            brand?: IBrand[];
            cart?: ICart;
            hot_keywords?: string[];
            notice?: IArticle[];
            help?: IArticleCategory[]|IArticle[];
        }>('shop/batch', data);
    }
}
