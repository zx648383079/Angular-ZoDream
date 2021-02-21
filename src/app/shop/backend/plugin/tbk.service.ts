import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData } from '../../../theme/models/page';

@Injectable({
  providedIn: 'root'
})
export class TbkService {

    constructor(private http: HttpClient) { }

    public search(params: any) {
        return this.http.get<IData<any>>('shop/admin/plugin/tbk', {params});
    }

    public option() {
        return this.http.get<any>('shop/admin/plugin/tbk/option');
    }

    public optionSave(data: any) {
        return this.http.post<any>('shop/admin/plugin/tbk/save_option', data);
    }

    public import(data: any) {
        return this.http.post<IData<any>>('shop/admin/plugin/tbk/import', data);
    }
}
