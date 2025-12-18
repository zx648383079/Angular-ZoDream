import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPage, IDataOne } from '../../../theme/models/page';
import { IBook, IChapter, IBookRole, IBookRoleRelation } from '../model';

@Injectable()
export class BookService {
    private readonly http = inject(HttpClient);


    public selfBookList(params: any) {
        return this.http.get<IPage<IBook>>('book/member/book', {params});
    }

    public selfBook(id: any) {
        return this.http.get<IBook>('book/member/book/detail', {params: {id}});
    }

    public selfSaveBook(data: any) {
        return this.http.post<IBook>('book/member/book/save', data);
    }

    public selfOverBook(id: any) {
        return this.http.put<IBook>('book/member/book/over', {id});
    }

    public selfChapter(id: any) {
        return this.http.get<IChapter>('book/member/book/chapter_detail', {params: {id}});
    }

    public selfSaveChapter(data: any) {
        return this.http.post<IChapter>('book/member/book/chapter_save', data);
    }

    public selfMoveChapter(data: any) {
        return this.http.post<IDataOne<boolean>>('book/member/book/move', data);
    }

    public selfRefreshPosition(id: number) {
        return this.http.post<IDataOne<boolean>>('book/member/book/refresh', {id});
    }

    public selfRemoveChapter(id: any) {
        return this.http.delete<IDataOne<boolean>>('book/member/book/chapter_delete', {params: {id}});
    }

    public roleList(book: number) {
        return this.http.get<{
            items: IBookRole[];
            link_items: IBookRoleRelation[];
        }>('book/member/book/role', {params: {book}});
    }

    public roleSave(data: any) {
        return this.http.post<IBookRole>('book/member/book/role_save', data);
    }

    public roleRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('book/member/book/role_delete', {params: {id}});
    }

    public LinkAdd(from: number, to: number, title = '') {
        return this.http.post<IBookRoleRelation>('book/member/book/link_add', {
            from, to, title
        });
    }

    public linkRemove(from: number, to: number) {
        return this.http.delete<IDataOne<boolean>>('book/member/book/link_delete', {params: {from, to}});
    }

}
