import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IResource } from '../model';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    constructor(
        private http: HttpClient,
    ) { }


    public categoryAll() {
        return this.http.get<IData<ICategory>>('res/category/level').pipe(map(res => res.data));
    }

    public resourceList(params: any) {
        return this.http.get<IPage<IResource>>('res/member/resource', {
            params
        });
    }

    public resource(id: any) {
        return this.http.get<IResource>('res/member/resource/detail', {
            params: {id},
        });
    }

    public resourceSave(data: any) {
        return this.http.post<IResource>('res/member/resource/save', data);
    }

    public resourceRemove(id: any) {
        return this.http.delete<IDataOne<true>>('res/member/resource/delete', {
          params: {id}
        });
    }
}
