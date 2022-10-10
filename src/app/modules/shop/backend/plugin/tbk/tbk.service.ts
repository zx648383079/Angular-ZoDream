import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne } from '../../../../../theme/models/page';

@Injectable()
export class TbkService {

    constructor(private http: HttpClient) { }

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
}
