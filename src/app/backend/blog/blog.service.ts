import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISubtotal, ICategory, ITag, IArchives, IBlog, ISearchForm } from 'src/app/theme/models/blog';
import { mockSubtotal, mockCategories, mockTags, mockArchives, mockBlog, mockBlogs } from 'src/app/theme/mock/blog';
import { IPage } from 'src/app/theme/models/page';
import { mockPage } from 'src/app/theme/mock/page';

@Injectable()
export class BlogService {

    constructor() { }

    public getSubtotal(): Observable<ISubtotal[]> {
        return of(mockSubtotal);
    }

    /**
     * getCategories
     */
    public getCategories(): Observable<ICategory[]> {
        return of(mockCategories);
    }

    public getTags(): Observable<ITag[]> {
        return of(mockTags);
    }

    /**
     * getArchives
     */
    public getArchives(): Observable<IArchives[]> {
        return of(mockArchives);
    }

    public getDetail(id: number): Observable<IBlog> {
        return of(mockBlog);
    }

    public getPage(param: ISearchForm): Observable<IPage<IBlog>> {
        return of(mockPage<IBlog>(mockBlogs));
    }
}
