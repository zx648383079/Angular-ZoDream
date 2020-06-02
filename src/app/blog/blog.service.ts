import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ICategory, IBlog, ISearchForm } from '../theme/models/blog';
import { mockCategories, mockBlog } from '../theme/mock/blog';
import { IPage } from '../theme/models/page';
import { mockPage } from '../theme/mock/page';

@Injectable()
export class BlogService {

  constructor(private http: HttpClient) { }

  /**
   * getCategories
   */
  public getCategories(): Observable<ICategory[]> {
    return of(mockCategories);
  }

  public getDetail(id: number): Observable<IBlog> {
    return of(mockBlog);
  }

  public getPage(param: ISearchForm): Observable<IPage<IBlog>> {
    return of(mockPage<IBlog>([mockBlog], param.page));
  }
}
