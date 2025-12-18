import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IResource, ITag } from '../model';
import { map } from 'rxjs';
import { IUploadResult } from '../../../theme/models/open';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private readonly http = inject(HttpClient);



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

    public upload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('res/member/resource/upload', data);
    }

    public tagList(params: any) {
        return this.http.get<IPage<ITag>>('res/tag', {params});
    }
}
