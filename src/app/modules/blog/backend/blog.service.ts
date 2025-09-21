import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory, ITag, IArchives, IBlog, IComment, IEditOptions } from '../model';
import { IPage, IData, IDataOne } from '../../../theme/models/page';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class BlogService {

    constructor(
        private http: HttpClient
    ) { }

    public statistics() {
        return this.http.get<any>('blog/admin/statistics');
    }

    /**
     * getCategories
     */
    public getCategories(): Observable<ICategory[]> {
        return this.http.get<IData<ICategory>>('blog/category').pipe(map(res => res.data));
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

    public getPage(params: any): Observable<IPage<IBlog>> {
        return this.http.get<IPage<IBlog>>('blog/admin/blog', {
            params
        });
    }

    public getComment(params: any): Observable<IPage<IComment>> {
        return this.http.get<IPage<IComment>>('blog/admin/comment', {
            params
        });
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/admin/comment/delete', {
            params: {id}
          });
    }

    public commentToggle(data: any) {
        return this.http.post<IComment>('blog/admin/comment/toggle', data);
    }

    public blogChange(data: any) {
        return this.http.post<IBlog>('blog/admin/blog/change', data);
    }

    public blogRemove(id: any) {
        return this.http.delete<IDataOne<true>>('blog/admin/blog/delete', {
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

    public categoryAll() {
        return this.http.get<IData<ICategory>>('blog/category/all').pipe(map(res => res.data));
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

    public tagAll() {
        return this.http.get<IData<ITag>>('blog/admin/tag/all').pipe(map(res => res.data));
    }

    public editOption() {
        return this.http.get<IEditOptions>('blog/home/edit_option');
    }
}
