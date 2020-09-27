import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDataOne, IPage } from '../../theme/models/page';
import { IRegion } from '../../theme/models/shop';

@Injectable()
export class RegionService {

    constructor(private http: HttpClient) { }

    public regionList(params: any) {
      return this.http.get<IPage<IRegion>>('shop/admin/region', {
          params,
      });
    }

    public region(id: any) {
        return this.http.get<IRegion>('shop/admin/region/detail', {
            params: {
                id
            },
        });
    }

    public regionSave(data: any) {
        return this.http.post<IRegion>('shop/admin/region/save', data);
    }

    public regionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/region/delete', {
            params: {
                id
            }
        });
    }

}
