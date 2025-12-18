import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDataOne, IPage } from '../../../../../theme/models/page';
import { IAffiliateLog, IShopPlugin } from '../../../model';

@Injectable()
export class AffiliateService {
    private readonly http = inject(HttpClient);


    public logList(params: any) {
        return this.http.get<IPage<IAffiliateLog>>('shop/admin/plugin/affiliate', {params});
    }

    public option() {
        return this.http.get<IDataOne<any>>('shop/admin/plugin/affiliate/option');
    }

    public optionSave(data: any) {
        return this.http.post<IDataOne<any>>('shop/admin/plugin/affiliate/save_option', data);
    }

    public statistics() {
        return this.http.get<any>('shop/admin/plugin/affiliate/statistics');
    }

    public pluginToggle() {
        return this.http.post<IShopPlugin>('shop/admin/plugin/toggle', {code: 'affiliate'});
    }
}
