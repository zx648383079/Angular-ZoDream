import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISubtotal, ICategory, ITag, IArchives, IBlog, ISearchForm, IComment } from '../../theme/models/blog';
import { mockSubtotal, mockCategories, mockTags, mockArchives, mockBlog, mockBlogs } from '../../theme/mock/blog';
import { IPage, IData, IDataOne } from '../../theme/models/page';
import { mockPage } from '../../theme/mock/page';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class BlogService {

    constructor(
        private http: HttpClient
    ) { }

    public getSubtotal(): Observable<ISubtotal[]> {
        return this.http.get<IData<ISubtotal>>('blog/home/subtotal').pipe(map(res => res.data));
    }

    /**
     * getCategories
     */
    public getCategories(): Observable<ICategory[]> {
        return this.http.get<IData<ICategory>>('blog/term').pipe(map(res => res.data));
    }

    public getTags(): Observable<ITag[]> {
        return this.http.get<IData<ITag>>('blog/tag').pipe(map(res => res.data));
    }

    /**
     * getArchives
     */
    public getArchives(): Observable<IArchives[]> {
        return this.http.get<IData<IArchives>>('blog/archives').pipe(map(res => res.data));
    }

    public getDetail(id: number): Observable<IBlog> {
        return this.http.get<IBlog>('blog/publish/detail', {
            params: {id: id.toString()}
        });
    }

    public getPage(param: ISearchForm): Observable<IPage<IBlog>> {
        return this.http.get<IPage<IBlog>>('blog', {
            params: param as any
          });
    }

    public getComment(param: ISearchForm): Observable<IPage<IComment>> {
        return this.http.get<IPage<IComment>>('blog/admin/comment', {
            params: param as any
          });
    }

    public blog(id: any) {
        return this.http.get<IBlog>('blog/publish/detail', {
          params: {id},
        });
    }

    public blogSave(data: any) {
        return this.http.post<IBlog>('blog/publish/save', data);
    }

    public blogRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/publish/delete', {
          params: {id}
        });
    }
}
