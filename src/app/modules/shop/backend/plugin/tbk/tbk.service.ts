import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne } from '../../../../../theme/models/page';
import { IShopPlugin } from '../../../model';

@Injectable()
export class TbkService {
    private readonly http = inject(HttpClient);


    public search(params: any) {
        return this.http.get<IData<any>>('shop/admin/plugin/tbk', {params});
    }

    public option() {
        return this.http.get<IDataOne<any>>('shop/admin/plugin/tbk/option');
    }

    public optionSave(data: any) {
        return this.http.post<IDataOne<any>>('shop/admin/plugin/tbk/save_option', data);
    }

    public import(data: any) {
        return this.http.post<IData<any>>('shop/admin/plugin/tbk/import', data);
    }

    public statistics() {
        return this.http.get<any>('shop/admin/plugin/tbk/statistics');
    }

    public pluginToggle() {
        return this.http.post<IShopPlugin>('shop/admin/plugin/toggle', {code: 'taobaoke'});
    }
}
