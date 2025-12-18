import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IAuthor, IBook, IBookList, IBookSpiderItem, ICategory, IChapter } from '../model';
import { IData, IDataOne, IPage } from '../../../theme/models/page';

@Injectable()
export class BookService {
    private readonly http = inject(HttpClient);



    public categoryList() {
        return this.http.get<IData<ICategory>>('book/admin/category');
    }

    public categoryAll() {
        return this.http.get<IData<ICategory>>('book/admin/category/all');
    }

    public category(id: any) {
        return this.http.get<ICategory>('book/admin/category/detail', {
          params: {id},
        });
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('book/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('book/admin/category/delete', {
          params: {id}
        });
    }

    public authorList(params: any) {
        return this.http.get<IPage<IAuthor>>('book/admin/author', {params});
    }

    public author(id: any) {
        return this.http.get<IAuthor>('book/admin/author/detail', {
          params: {id},
        });
    }

    public authorSave(data: any) {
        return this.http.post<IAuthor>('book/admin/author/save', data);
    }

    public authorRemove(id: any) {
        return this.http.delete<IDataOne<true>>('book/admin/author/delete', {
          params: {id}
        });
    }

    public bookList(params: any) {
        return this.http.get<IPage<IBook>>('book/admin/book', {params});
    }

    public book(id: any) {
        return this.http.get<IBook>('book/admin/book/detail', {
          params: {id},
        });
    }

    public bookSave(data: any) {
        return this.http.post<IBook>('book/admin/book/save', data);
    }

    public bookRemove(id: any) {
        return this.http.delete<IDataOne<true>>('book/admin/book/delete', {
          params: {id}
        });
    }

    public chapterList(params: any) {
        return this.http.get<IPage<IChapter>>('book/admin/book/chapter', {params});
    }

    public chapter(id: any) {
        return this.http.get<IChapter>('book/admin/book/chapter_detail', {
          params: {id},
        });
    }

    public chapterSave(data: any) {
        return this.http.post<IChapter>('book/admin/book/chapter_save', data);
    }

    public chapterRemove(id: any) {
        return this.http.delete<IDataOne<true>>('book/admin/book/chapter_delete', {
          params: {id}
        });
    }

    public listList(params: any) {
        return this.http.get<IPage<IBookList>>('book/admin/list', {params});
    }

    public list(id: any) {
        return this.http.get<IBookList>('book/admin/list/detail', {
          params: {id},
        });
    }

    public listSave(data: any) {
        return this.http.post<IBookList>('book/admin/list/save', data);
    }

    public listRemove(id: any) {
        return this.http.delete<IDataOne<true>>('book/admin/list/delete', {
          params: {id}
        });
    }

    public sortOut() {
        return this.http.post<IDataOne<true>>('book/admin/book/sort_out', {});
    }

    public spiderSearch(params: any) {
        return this.http.post<IData<IBookSpiderItem>>('book/admin/spider', params);
    }

    public spiderAsync(data: any) {
        return this.http.post<IDataOne<{
            key: string;
            next: number;
            count: number;
        }>>('book/admin/spider/async', data);
    }

    public statistics() {
        return this.http.get<any>('book/admin/statistics');
    }
}
