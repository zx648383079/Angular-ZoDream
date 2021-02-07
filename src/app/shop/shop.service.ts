import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IPage } from '../theme/models/page';
import { ISite } from '../theme/models/seo';
import { IArticle, IArticleCategory, ICart, ICartDialog, ICartItem, ICategory, IGoods, IHomeProduct, IOrder, IPayment, IShipping } from '../theme/models/shop';

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

    public site(id: any) {
        return this.http.get<ISite>('shop/store', {params: {id}});
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
}
