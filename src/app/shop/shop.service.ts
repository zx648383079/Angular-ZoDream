import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { ISite } from '../theme/models/seo';
import { IAd, IAddress, IArticle, IArticleCategory, IBrand, ICart, ICartDialog, ICartItem, ICategory, IComment, ICommentSubtotal, IGoods, IHomeProduct, IOrder, IOrderCount, IPayment, IShipping } from '../theme/models/shop';
import { IUser } from '../theme/models/user';

@Injectable()
export class ShopService {

    constructor(
        private http: HttpClient
    ) { }

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

    public goods(id: any) {
        return this.http.get<IGoods>('shop/goods', {
            params: {id}
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

    public paymentList(goods?: number[], shipping?: number) {
        return this.http.post<IData<IPayment>>('shop/cashier/payment', {goods, shipping});
    }

    public shippingList(goods: number[] | ICartItem[], address: number, type: number = 0) {
        return this.http.post<IData<IShipping>>('shop/cashier/shipping', {goods, address, type});
    }

    public previewOrder(goods: number[] | ICartItem[],
                        address: number, shipping: number = 0, payment: number = 0, type: number = 0) {
        return this.http.post<IOrder>('shop/cashier/preview', {goods, address, shipping, payment, type});
    }

    public checkoutOrder(goods: number[] | ICartItem[],
                         address: number, shipping: number, payment: number, type: number = 0) {
        return this.http.post<IOrder>('shop/cashier/checkout', {goods, address, shipping, payment, type});
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

    public orderSubtotal() {
        return this.http.get<IOrderCount>('shop/order/count');
    }

    public addressList(params: any) {
        return this.http.get<IPage<IAddress>>('shop/address', {params});
    }
}
