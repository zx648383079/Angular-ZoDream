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

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/admin/comment/delete', {
            params: {id}
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

    public category(id: any) {
        return this.http.get<ICategory>('blog/admin/category/detail', {
          params: {id},
        });
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('blog/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/admin/category/delete', {
          params: {id}
        });
    }

    public tag(id: any) {
        return this.http.get<ITag>('blog/admin/tag/detail', {
          params: {id},
        });
    }

    public tagSave(data: any) {
        return this.http.post<ITag>('blog/admin/tag/save', data);
    }

    public tagRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/admin/tag/delete', {
          params: {id}
        });
    }
}
