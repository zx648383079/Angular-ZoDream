import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, scheduled } from 'rxjs';


export interface ITag {
  name: string;
  count: number;
  style?: string;
}

export interface ICategory {
  id: number;
  name: string;
  blog_count?: number;
}

export interface IArchives {
  year: string;
  children: {
    id: number,
    title: string,
    date: string
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  /**
   * getCategories
   */
  public getCategories(): Observable<ICategory[]> {
    return of([
      {id: 1, name: 'zodream'}
    ]);
  }

  public getTags(): Observable<ITag[]> {
    return of([
      {name: 'php', count: 1}
    ]);
  }

  /**
   * getArchives
   */
  public getArchives(): Observable<IArchives[]> {
    return of<IArchives[]>([
      {
        year: '2020',
        children: [
          {id: 1, title: '1231', date: '05-07'}
        ]
      }
    ]);
  }
}
