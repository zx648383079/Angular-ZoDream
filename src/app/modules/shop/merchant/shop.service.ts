import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage, IDataOne, IData } from '../../../theme/models/page';
import { IGoods, ICategory, IBrand, IGoodsCard, IAttributeGroup, IGoodsAttribute, IOrder, IDelivery } from '../model';

@Injectable()
export class ShopService {

    constructor(
        private http: HttpClient
    ) { }


    public goodsList(params: any) {
        return this.http.get<IPage<IGoods>>('shop/merchant/goods', {
            params
        });
    }

    public goods(id: any) {
        return this.http.get<IGoods>('shop/merchant/goods/detail', {
            params: {
                id
            },
        });
    }

    public goodsPreview(id: any) {
        return this.http.get<IGoods>('shop/merchant/goods/preview', {
            params: {
                id
            },
        });
    }

    public goodsSave(data: any) {
        return this.http.post<IGoods>('shop/merchant/goods/save', data);
    }

    public goodsToggle(data: any) {
        return this.http.post<IDataOne<true>>('shop/merchant/goods/toggle', data);
    }

    public goodsRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/merchant/goods/delete', {
            params: {
                id
            }
        });
    }

    public goodsAttribute(groupId: number, goodsId = 0) {
        return this.http.get<IGoodsAttribute>('shop/merchant/goods/attribute', {
            params: {group_id: groupId.toString(), goods_id: goodsId.toString()}
        });
    }

    public createSn() {
        return this.http.get<IDataOne<string>>('shop/merchant/goods/generate_sn');
    }

    
    public categoryAll() {
        return this.http.get<IData<ICategory>>('shop/admin/category/all');
    }

    public brandAll() {
        return this.http.get<IData<IBrand>>('shop/admin/brand/all');
    }

    public cardList(params: any) {
        return this.http.get<IPage<IGoodsCard>>('shop/merchant/goods/card', {
            params,
        });
    }

    public cardRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/merchant/goods/card_delete', {
            params: {
                id
            }
        });
    }

    public cardGenerate(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/merchant/goods/card_generate', data);
    }

    public cardImport(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/merchant/goods/card_import', data);
    }

    public orderList(params: any) {
        return this.http.get<IPage<IOrder>>('shop/merchant/order', {
            params
        });
    }

    public order(id: any) {
        return this.http.get<IOrder>('shop/merchant/order/detail', {
            params: {id}
        });
    }

    public orderSave(data: any) {
        return this.http.post<IOrder>('shop/merchant/order/save', data);
    }

    public orderRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/merchant/order/delete', {
            params: {id}
        });
    }

    public deliveryList(params: any) {
        return this.http.get<IPage<IDelivery>>('shop/merchant/delivery', {
            params
        });
    }

    public delivery(id: any) {
        return this.http.get<IDelivery>('shop/merchant/delivery/detail', {
            params: {id}
        });
    }

    public deliverySave(data: any) {
        return this.http.post<IDelivery>('shop/merchant/delivery/save', data);
    }

    public deliveryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('shop/merchant/delivery/delete', {
            params: {id}
        });
    }

    public batch(data: {
        category?: any;
        brand?: any;
        group?: any;
    }) {
        return this.http.post<{
            category?: ICategory[];
            brand?: IBrand[];
            group?: IAttributeGroup[];
        }>('shop/merchant/batch', data);
    }
}
