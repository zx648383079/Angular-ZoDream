import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ICategory, IBlog, ISearchForm } from '../theme/models/blog';
import { mockCategories, mockBlog } from '../theme/mock/blog';
import { IPage, IData } from '../theme/models/page';
import { mockPage } from '../theme/mock/page';
import { map } from 'rxjs/operators';

@Injectable()
export class BlogService {

  constructor(private http: HttpClient) { }

  /**
   * getCategories
   */
  public getCategories(): Observable<ICategory[]> {
    return this.http.get<IData<ICategory>>('blog/term').pipe(map(res => res.data));
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
}
