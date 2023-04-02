import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { IUploadResult } from '../../../theme/models/open';
import { IBlog, ICategory, IEditOptions, ITag } from '../model';
import { map } from 'rxjs';
import { IItem } from '../../../theme/models/seo';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    constructor(
        private http: HttpClient,
    ) { }


    public categoryAll() {
        return this.http.get<IData<ICategory>>('blog/category/all').pipe(map(res => res.data));
    }

    public blogList(params: any) {
        return this.http.get<IPage<IBlog>>('blog/publish/page', {
            params
        });
    }

    public blog(id: any) {
        return this.http.get<IBlog>('blog/publish/detail', {
            params: {id},
        });
    }

    public blogSave(data: any) {
        return this.http.post<IBlog>('blog/publish', data);
    }

    public blogRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/publish/delete', {
          params: {id}
        });
    }

    public editOption() {
        return this.http.get<IEditOptions>('blog/home/edit_option');
    }
}
