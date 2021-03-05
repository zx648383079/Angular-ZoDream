import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ICategory, ITag, IArchives, IBlog, ISearchForm, IComment } from '../../theme/models/blog';
import { IPage, IData, IDataOne } from '../../theme/models/page';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    constructor(private http: HttpClient) { }

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
        return this.http.get<IBlog>('blog', {
            params: {id: id.toString()}
        });
    }

    public getPage(param: ISearchForm): Observable<IPage<IBlog>> {
        return this.http.get<IPage<IBlog>>('blog', {
            params: param as any
        });
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('blog/comment', {
            params
        });
    }

    public comment(id: any) {
        return this.http.get<IComment>('blog/comment/detail', {
            params: {id}
        });
    }

    public commentSave(data: any) {
        return this.http.post<IComment>('blog/comment/save', data);
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('blog/comment/delete', {
            params: {id}
        });
    }

    public commentAgree(id: any) {
        return this.http.post<IComment>('blog/comment/agree', {id});
    }

    public commentDisagree(id: any) {
        return this.http.post<IComment>('blog/comment/disagree', {id});
    }
}
