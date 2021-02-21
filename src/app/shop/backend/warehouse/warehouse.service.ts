import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../../theme/models/page';
import { IWarehouse, IWarehouseGoods, IWarehouseLog } from '../../../theme/models/shop';

@Injectable()
export class WarehouseService {

    constructor(private http: HttpClient) {}

    public warehouseList(params: any) {
        return this.http.get<IPage<IWarehouse>>('shop/admin/warehouse', {
            params,
        });
    }

    public warehouse(id: any) {
        return this.http.get<IWarehouse>('shop/admin/warehouse/detail', {
            params: {
                id
            },
        });
    }

    public warehouseSave(data: any) {
        return this.http.post<IWarehouse>('shop/admin/warehouse/save', data);
    }

    public warehouseRemove(id: any) {
        return this.http.delete<IDataOne<true>> ('shop/admin/warehouse/delete', {
            params: {
                id
            }
        });
    }

    public logList(params: any) {
        return this.http.get<IPage<IWarehouseLog>>('shop/admin/warehouse/log', {
            params,
        });
    }

    public goodsList(params: any) {
        return this.http.get<IPage<IWarehouseGoods>>('shop/admin/warehouse/goods', {
            params,
        });
    }

    public goodsChange(data: any) {
        return this.http.post<IWarehouseLog>('shop/admin/warehouse/goods_change', data);
    }

}
