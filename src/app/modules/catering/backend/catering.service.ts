import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ICateringStore } from '../model';
import { IDataOne, IPage } from '../../../theme/models/page';

@Injectable({
  providedIn: 'root'
})
export class CateringBackendService {
    private http = inject(HttpClient);


    public storeList(params: any) {
        return this.http.get<IPage<ICateringStore>>('catering/admin/store', {params});
    }

    public store(id: any) {
        return this.http.get<ICateringStore>('catering/admin/store/detail', {params: {id}});
    }

    public storeSave(data: any) {
        return this.http.post<ICateringStore>('catering/admin/store/save', data);
    }

    public storeRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('catering/admin/store/delete', {params: {id}});
    }

    public statistics() {
        return this.http.get<any>('catering/admin/statistics');
    }
}
